import {
    Form,
    Modal,
    Select,
    SelectItem,
    SelectSkeleton,
    TextInput,
} from "@carbon/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    CreateCategoryRequest,
    CreateCategorySchema,
    ValidationResponse,
    CategoryListType,
} from "@/app/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    useCreateCategory,
    useGetCategoryGroups,
    useGetCategoryStatuses,
    useUpdateCategory,
} from "../hooks";
import { useModalLoading } from "@/app/hooks";
import { useQueryClient } from "@tanstack/react-query";

interface CategoryModalProps {
    open: boolean;
    onClose: () => void;
    category: CategoryListType | null;
}

export const CategoryModal = ({
    open,
    onClose,
    category,
}: CategoryModalProps) => {
    const queryClient = useQueryClient();

    const { data: categoryGroups, isPending: loadingCategoryGroups } =
        useGetCategoryGroups();
    const { data: categoryStatuses, isPending: loadingCategoryStatuses } =
        useGetCategoryStatuses();

    const {
        mutateAsync: CreateCategory,
        isPending: isCreating,
        isError: createError,
        isSuccess: createSuccess,
        reset: resetCreate,
    } = useCreateCategory();

    const {
        mutateAsync: UpdateCategory,
        isPending: isUpdating,
        isError: updateError,
        isSuccess: updateSuccess,
        reset: resetUpdate,
    } = useUpdateCategory();

    const { status } = useModalLoading({
        loading: isCreating || isUpdating,
        success: createSuccess || updateSuccess,
        error: createError || updateError,
    });

    const form = useForm({
        resolver: zodResolver(CreateCategorySchema),
        mode: "all",
    });

    const {
        register,
        formState: { errors },
        handleSubmit,
        setError,
        reset,
    } = form;

    useEffect(() => {
        if (open) {
            if (category) {
                reset({
                    name: category.name,
                    category_group: category.category_group.toString(),
                    status: category.status.toString(),
                });
            } else {
                reset({
                    name: "",
                    category_group: "",
                    status: "",
                });
            }
        } else {
            reset({ name: "", category_group: "", status: "" });
            resetCreate();
            resetUpdate();
        }
    }, [open, category, reset, resetCreate, resetUpdate]);

    const onSubmit = (payload: CreateCategoryRequest) => {
        const mutationProvider = category
            ? UpdateCategory({ id: category.id, payload: payload })
            : CreateCategory(payload);

        mutationProvider
            .then(() => {
                queryClient.invalidateQueries({
                    queryKey: ["paginate-categories"],
                });
                setTimeout(() => {
                    onClose(); // Parent should handle state cleanup if needed
                }, 500);
            })
            .catch((error: ValidationResponse) => {
                if (error.errors) {
                    const serverErrors = error.errors;
                    Object.entries(serverErrors).forEach(([field, message]) => {
                        setError(field as keyof CreateCategoryRequest, {
                            type: "server",
                            message: message ?? "Error",
                        });
                    });
                }

                setTimeout(() => {
                    resetCreate();
                    resetUpdate();
                }, 1000);
            });
    };

    return (
        <Modal
            aria-label={category ? "Edit category" : "Add category"}
            modalHeading={category ? "Edit Category" : "Add Category"}
            open={open}
            onRequestClose={onClose}
            primaryButtonText={category ? "Save" : "Add"}
            secondaryButtonText="Cancel"
            size="sm"
            loadingStatus={status}
            loadingDescription={category ? "Updating..." : "Creating..."}
            onRequestSubmit={handleSubmit(onSubmit)}
        >
            <Form className="flex flex-col gap-5">
                <TextInput
                    id="name"
                    labelText="Name"
                    size="lg"
                    placeholder="Category Name"
                    {...register("name")}
                    invalid={errors.name ? true : false}
                    invalidText={errors.name?.message}
                />
                {loadingCategoryGroups ? (
                    <SelectSkeleton />
                ) : (
                    <Select
                        id="category_group"
                        labelText="Category Group"
                        size="lg"
                        helperText="(Clothing & Accessories, Electronics, Vehicle, Others)"
                        {...register("category_group")}
                        invalid={errors.category_group ? true : false}
                        invalidText={errors.category_group?.message}
                    >
                        {categoryGroups?.category_groups.map((group) => (
                            <SelectItem key={group.id} text={group.name} value={group.id} />
                        ))}
                    </Select>
                )}

                {loadingCategoryStatuses ? (
                    <SelectSkeleton />
                ) : (
                    <Select
                        id="status"
                        labelText="Status"
                        size="lg"
                        helperText="(Active, Inactive, Draft)"
                        {...register("status")}
                        invalid={errors.status ? true : false}
                        invalidText={errors.status?.message}
                    >
                        {categoryStatuses?.category_statuses.map((status) => (
                            <SelectItem
                                key={status.id}
                                text={status.name}
                                value={status.id}
                            />
                        ))}
                    </Select>
                )}
            </Form>
        </Modal>
    );
};
