import {
  ComposedModal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  NumberInput,
  Select,
  SelectItem,
  TextArea,
  TextInput,
  FileUploader,
  FileUploaderItem,
  Button,
} from "@carbon/react";
import { useEffect, useState } from "react";
import { Close } from "@carbon/icons-react";
import {
  CreateProductRequest,
  CreateProductSchema,
  Product,
  ProductCondition,
  ProductStatus,
} from "@/app/types/product";
import { Category } from "@/app/types/category";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface CategoryOption {
  id: number;
  name: string;
}

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProductRequest) => void;
  initialData?: Product;
  categories: CategoryOption[];
  conditions: ProductCondition[];
  statuses: ProductStatus[];
}

export const ProductFormModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  categories,
  conditions,
  statuses,
}: ProductFormModalProps) => {
  const [files, setFiles] = useState<
    { id: string; file: File; preview: string }[]
  >([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue,
  } = useForm<CreateProductRequest>({
    resolver: zodResolver(CreateProductSchema),
    mode: "onSubmit",
  });

  // Watch form values for debugging
  const watchedValues = watch();

  useEffect(() => {
    if (open) {
      if (initialData) {
        const initialValues = {
          name: initialData.name,
          description: initialData.description,
          price: initialData.price,
          location: initialData.location,
          category:
            initialData.category_id?.toString() ||
            initialData.category?.id?.toString() ||
            "",
          condition:
            initialData.product_condition_id?.toString() ||
            initialData.product_condition?.id?.toString() ||
            "",
          status:
            initialData.status_id?.toString() ||
            initialData.status?.id?.toString() ||
            "",
        };
        console.log(
          "[ProductFormModal] Resetting form with initial data:",
          initialValues,
        );
        reset(initialValues);
        // Set existing images
        setExistingImages(initialData.images || []);
        // Reset new file selections and revoke any existing preview URLs
        files.forEach((file) => URL.revokeObjectURL(file.preview));
        setFiles([]);
        setValue("images", []);
      } else {
        const emptyValues = {
          name: "",
          description: "",
          price: 0,
          location: "",
          category: "",
          condition: "",
          status: "",
        };
        console.log(
          "[ProductFormModal] Resetting form with empty values:",
          emptyValues,
        );
        reset(emptyValues);
        // Reset file selections and revoke any existing preview URLs
        setExistingImages([]);
        files.forEach((file) => URL.revokeObjectURL(file.preview));
        setFiles([]);
        setValue("images", []);
      }
    } else {
      // Reset form and files when modal closes
      reset({
        name: "",
        description: "",
        price: 0,
        location: "",
        category: "",
        condition: "",
        status: "",
      });
      setExistingImages([]);
      // Revoke all object URLs before clearing files
      files.forEach((file) => URL.revokeObjectURL(file.preview));
      setFiles([]);
      setValue("images", []);
    }
  }, [open, initialData, reset, setValue]);

  // Cleanup: Revoke object URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, []);

  // Debug: Log form values when they change
  useEffect(() => {
    console.log("[ProductFormModal] Form values changed:", watchedValues);
  }, [watchedValues]);

  const handleFileUpload = (event: { target: { files: FileList | null } }) => {
    const uploadedFiles = Array.from(event.target.files || []);
    if (uploadedFiles.length > 0) {
      const newFileEntries = uploadedFiles.map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
      }));
      const updatedFiles = [...files, ...newFileEntries];
      setFiles(updatedFiles);
      setValue(
        "images",
        updatedFiles.map((entry) => entry.file),
      );
    }
  };

  const handleFileDelete = (fileId: string) => {
    const fileToDelete = files.find((entry) => entry.id === fileId);
    if (fileToDelete) {
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(fileToDelete.preview);
    }
    const newFiles = files.filter((entry) => entry.id !== fileId);
    setFiles(newFiles);
    setValue(
      "images",
      newFiles.map((entry) => entry.file),
    );
  };

  const handleExistingImageDelete = (imagePath: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== imagePath));
  };

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API || "";
    return `${apiUrl}${imagePath}`;
  };

  const onFormSubmit = (data: CreateProductRequest) => {
    console.log("[ProductFormModal] Form submitted with data:", data);
    console.log(
      "[ProductFormModal] Current watched values before submit:",
      watchedValues,
    );
    console.log(
      "[ProductFormModal] Condition value in payload:",
      data.condition,
    );
    console.log("[ProductFormModal] Status value in payload:", data.status);
    // Include selected files and existing images to keep
    const submitData = {
      ...data,
      images: files.length > 0 ? files.map((entry) => entry.file) : undefined,
      existingImages: initialData ? existingImages : undefined, // Only include when editing
    };
    onSubmit(submitData);
  };

  return (
    <ComposedModal open={open} onClose={onClose} size="lg">
      <ModalHeader title={initialData ? "Edit Product" : "Add Product"} />
      <ModalBody hasForm>
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              id="name"
              labelText="Product Name"
              placeholder="Enter product name"
              {...register("name")}
              invalid={!!errors.name}
              invalidText={errors.name?.message}
            />

            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <NumberInput
                  id="price"
                  label="Price"
                  ref={ref}
                  value={value || 0}
                  onBlur={onBlur}
                  invalid={!!errors.price}
                  invalidText={errors.price?.message}
                  onChange={(_, { value }) => onChange(value)}
                />
              )}
            />
          </div>

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextArea
                id="description"
                labelText="Description"
                placeholder="Enter product description"
                ref={ref}
                value={value || ""}
                onBlur={onBlur}
                onChange={(e) => onChange(e.target.value)}
                invalid={!!errors.description}
                invalidText={errors.description?.message}
              />
            )}
          />

          <TextInput
            id="location"
            labelText="Location"
            placeholder="Enter product location"
            {...register("location")}
            invalid={!!errors.location}
            invalidText={errors.location?.message}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value, ref } }) => (
                <Select
                  id="category"
                  labelText="Category"
                  ref={ref}
                  value={value || ""}
                  onChange={(e) => onChange(e.target.value)}
                  invalid={!!errors.category}
                  invalidText={errors.category?.message}
                >
                  <SelectItem value="" text="Select a category" />
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat.id}
                      value={cat.id.toString()}
                      text={cat.name}
                    />
                  ))}
                </Select>
              )}
            />

            <Select
              id="condition"
              labelText="Condition"
              {...register("condition", {
                onChange: (e) => {
                  console.log(
                    "[ProductFormModal] Condition Select onChange triggered:",
                    {
                      event: e,
                      targetValue: e.target?.value,
                      currentFormValue: watchedValues.condition,
                    },
                  );
                },
              })}
              invalid={!!errors.condition}
              invalidText={errors.condition?.message}
            >
              <SelectItem value="" text="Select a condition" />
              {conditions
                .filter((cond) => cond.id !== undefined)
                .map((cond) => (
                  <SelectItem
                    key={cond.id!}
                    value={cond.id!.toString()}
                    text={cond.name || ""}
                  />
                ))}
            </Select>

            <Select
              id="status"
              labelText="Status"
              {...register("status", {
                onChange: (e) => {
                  console.log(
                    "[ProductFormModal] Status Select onChange triggered:",
                    {
                      event: e,
                      targetValue: e.target?.value,
                      currentFormValue: watchedValues.status,
                    },
                  );
                },
              })}
              invalid={!!errors.status}
              invalidText={errors.status?.message}
            >
              <SelectItem value="" text="Select a status" />
              {statuses
                .filter((stat) => stat.id !== undefined)
                .map((stat) => (
                  <SelectItem
                    key={stat.id!}
                    value={stat.id!.toString()}
                    text={stat.name || ""}
                  />
                ))}
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <FileUploader
              key={
                open
                  ? `uploader-${initialData?.id || "new"}`
                  : "uploader-closed"
              }
              accept={["image/*"]}
              buttonKind="primary"
              buttonLabel="Add images"
              filenameStatus="edit"
              iconDescription="Delete file"
              labelDescription="Only image files are supported. Max file size is 10MB."
              labelTitle="Product Images"
              multiple
              onChange={handleFileUpload}
              size="md"
            />

            {/* Show existing images when editing */}
            {initialData && existingImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Existing Images</p>
                <div className="grid grid-cols-4 gap-2">
                  {existingImages.map((imagePath, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={getImageUrl(imagePath)}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full object-cover rounded border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <Button
                        kind="danger"
                        size="sm"
                        hasIconOnly
                        iconDescription="Delete image"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleExistingImageDelete(imagePath)}
                      >
                        <Close size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Show new file uploads with preview */}
            {files.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">New Images</p>
                <div className="grid grid-cols-4 gap-2">
                  {files.map((fileEntry) => (
                    <div
                      key={fileEntry.id}
                      className="relative group aspect-square"
                    >
                      <img
                        src={fileEntry.preview}
                        alt={fileEntry.file.name}
                        className="w-full h-full object-cover rounded border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <Button
                        kind="danger"
                        size="sm"
                        hasIconOnly
                        iconDescription="Delete image"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleFileDelete(fileEntry.id)}
                      >
                        <Close size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </ModalBody>
      <ModalFooter
        primaryButtonText={initialData ? "Save Changes" : "Create Product"}
        secondaryButtonText="Cancel"
        onRequestSubmit={handleSubmit(onFormSubmit)}
        onRequestClose={onClose}
      >
        {null}
      </ModalFooter>
    </ComposedModal>
  );
};
