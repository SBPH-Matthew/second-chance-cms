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
} from "@carbon/react";
import { useEffect, useState } from "react";
import { Product, ProductCategory, ProductCondition, ProductStatus } from "@/app/types/product";

interface ProductFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Product>) => void;
    initialData?: Product;
    categories: ProductCategory[];
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
    const [formData, setFormData] = useState<Partial<Product>>({
        name: "",
        description: "",
        price: 0,
        categoryId: 0,
        productConditionId: 0,
        statusId: 0,
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: "",
                description: "",
                price: 0,
                categoryId: categories[0]?.id || 0,
                productConditionId: conditions.find((c) => c.name === "New")?.id || conditions[0]?.id || 0,
                statusId: statuses.find((s) => s.name === "DRAFT")?.id || statuses[0]?.id || 0,
            });
        }
    }, [initialData, open, categories, conditions, statuses]);

    const handleChange = (field: keyof Product, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
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
                            value={formData.name || ""}
                            onChange={(e) => handleChange("name", e.target.value)}
                        />
                        <NumberInput
                            id="price"
                            label="Price"
                            min={0}
                            step={0.01}
                            value={formData.price || 0}
                            onChange={(e, { value }) => handleChange("price", Number(value))}
                        />
                    </div>

                    <TextArea
                        id="description"
                        labelText="Description"
                        placeholder="Enter product description"
                        value={formData.description || ""}
                        onChange={(e) => handleChange("description", e.target.value)}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select
                            id="category"
                            labelText="Category"
                            value={formData.categoryId || ""}
                            onChange={(e) => handleChange("categoryId", Number(e.target.value))}
                        >
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id} text={cat.name} />
                            ))}
                        </Select>

                        <Select
                            id="condition"
                            labelText="Condition"
                            value={formData.productConditionId || ""}
                            onChange={(e) => handleChange("productConditionId", Number(e.target.value))}
                        >
                            {conditions.map((cond) => (
                                <SelectItem key={cond.id} value={cond.id} text={cond.name} />
                            ))}
                        </Select>

                        <Select
                            id="status"
                            labelText="Status"
                            value={formData.statusId || ""}
                            onChange={(e) => handleChange("statusId", Number(e.target.value))}
                        >
                            {statuses.map((stat) => (
                                <SelectItem key={stat.id} value={stat.id} text={stat.name} />
                            ))}
                        </Select>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter
                primaryButtonText={initialData ? "Save Changes" : "Create Product"}
                secondaryButtonText="Cancel"
                onRequestSubmit={handleSubmit}
                onRequestClose={onClose}
            >
                {null}
            </ModalFooter>
        </ComposedModal>
    );
};
