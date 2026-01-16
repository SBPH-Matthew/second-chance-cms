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
  Button,
} from "@carbon/react";
import { useEffect, useState } from "react";
import { Close } from "@carbon/icons-react";
import {
  CreateVehicleRequest,
  CreateVehicleSchema,
  Vehicle,
  VehicleType,
} from "@/app/types/vehicle";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface VehicleFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateVehicleRequest) => void;
  initialData?: Vehicle;
  vehicleTypes: VehicleType[];
  isSubmitting?: boolean;
}

export const VehicleFormModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  vehicleTypes,
  isSubmitting = false,
}: VehicleFormModalProps) => {
  const [files, setFiles] = useState<{ id: string; file: File }[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<CreateVehicleRequest>({
    resolver: zodResolver(CreateVehicleSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        const initialValues = {
          vehicleMake: initialData.vehicle_make || "",
          vehicleModel: initialData.vehicle_model || "",
          year: initialData.year,
          price: initialData.price,
          description: initialData.description || "",
          location: initialData.location || "",
          vehicleType: initialData.vehicle_type_id || 0,
        };
        reset(initialValues);
        setExistingImages(initialData.images || []);
        setFiles([]);
        setValue("images", []);
      } else {
        const emptyValues = {
          vehicleMake: "",
          vehicleModel: "",
          year: new Date().getFullYear(),
          price: 0,
          description: "",
          location: "",
          vehicleType: 0,
        };
        reset(emptyValues);
        setExistingImages([]);
        setFiles([]);
        setValue("images", []);
      }
    } else {
      reset({
        vehicleMake: "",
        vehicleModel: "",
        year: new Date().getFullYear(),
        price: 0,
        description: "",
        location: "",
        vehicleType: 0,
      });
      setExistingImages([]);
      setFiles([]);
      setValue("images", []);
    }
  }, [open, initialData, reset, setValue]);

  const handleFileUpload = (event: { target: { files: FileList | null } }) => {
    const uploadedFiles = Array.from(event.target.files || []);
    if (uploadedFiles.length > 0) {
      const newFileEntries = uploadedFiles.map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
      }));
      const updatedFiles = [...files, ...newFileEntries];
      setFiles(updatedFiles);
      setValue(
        "images",
        updatedFiles.map((entry) => entry.file)
      );
    }
  };

  const handleFileDelete = (fileId: string) => {
    const newFiles = files.filter((entry) => entry.id !== fileId);
    setFiles(newFiles);
    setValue(
      "images",
      newFiles.map((entry) => entry.file)
    );
  };

  const handleExistingImageDelete = (imagePath: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== imagePath));
  };

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API || '';
    return `${apiUrl}${imagePath}`;
  };

  const onFormSubmit = (data: CreateVehicleRequest) => {
    const submitData = {
      ...data,
      images: files.length > 0 ? files.map((entry) => entry.file) : undefined,
      existingImages: initialData ? existingImages : undefined,
    };
    onSubmit(submitData);
  };

  return (
    <ComposedModal open={open} onClose={onClose} size="lg">
      <ModalHeader title={initialData ? "Edit Vehicle" : "Add Vehicle"} />
      <ModalBody hasForm>
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              id="vehicleMake"
              labelText="Vehicle Make"
              placeholder="Enter vehicle make"
              {...register("vehicleMake")}
              invalid={!!errors.vehicleMake}
              invalidText={errors.vehicleMake?.message}
            />

            <TextInput
              id="vehicleModel"
              labelText="Vehicle Model"
              placeholder="Enter vehicle model"
              {...register("vehicleModel")}
              invalid={!!errors.vehicleModel}
              invalidText={errors.vehicleModel?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Controller
              control={control}
              name="year"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <NumberInput
                  id="year"
                  label="Year"
                  ref={ref}
                  value={value || new Date().getFullYear()}
                  onBlur={onBlur}
                  min={1900}
                  max={new Date().getFullYear() + 1}
                  invalid={!!errors.year}
                  invalidText={errors.year?.message}
                  onChange={(_, { value }) => onChange(value)}
                />
              )}
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
                  min={0}
                  invalid={!!errors.price}
                  invalidText={errors.price?.message}
                  onChange={(_, { value }) => onChange(value)}
                />
              )}
            />

            <Controller
              control={control}
              name="vehicleType"
              render={({ field: { onChange, value, ref } }) => (
                <Select
                  id="vehicleType"
                  labelText="Vehicle Type"
                  ref={ref}
                  value={value?.toString() || ""}
                  onChange={(e) => onChange(Number(e.target.value))}
                  invalid={!!errors.vehicleType}
                  invalidText={errors.vehicleType?.message}
                >
                  <SelectItem value="" text="Select a vehicle type" />
                  {vehicleTypes.map((vt) => (
                    <SelectItem
                      key={vt.id}
                      value={vt.id.toString()}
                      text={vt.name}
                    />
                  ))}
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              id="location"
              labelText="Location"
              placeholder="Enter location"
              {...register("location")}
              invalid={!!errors.location}
              invalidText={errors.location?.message}
            />
          </div>

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextArea
                id="description"
                labelText="Description"
                placeholder="Enter vehicle description"
                ref={ref}
                value={value || ""}
                onBlur={onBlur}
                onChange={(e) => onChange(e.target.value)}
                invalid={!!errors.description}
                invalidText={errors.description?.message}
              />
            )}
          />

          <div className="flex flex-col gap-2">
            <FileUploader
              key={open ? `uploader-${initialData?.id || 'new'}` : 'uploader-closed'}
              accept={["image/*"]}
              buttonKind="primary"
              buttonLabel="Add images"
              filenameStatus="edit"
              iconDescription="Delete file"
              labelDescription="Only image files are supported. Max file size is 10MB."
              labelTitle="Vehicle Images"
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
                        alt={`Vehicle image ${index + 1}`}
                        className="w-full h-full object-cover rounded border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
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

            {/* Show new file previews */}
            {files.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">New Images</p>
                <div className="grid grid-cols-4 gap-2">
                  {files.map((fileEntry) => (
                    <div key={fileEntry.id} className="relative group aspect-square">
                      <img
                        src={URL.createObjectURL(fileEntry.file)}
                        alt={fileEntry.file.name}
                        className="w-full h-full object-cover rounded border"
                      />
                      <Button
                        kind="danger"
                        size="sm"
                        hasIconOnly
                        iconDescription="Delete file"
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
      <ModalFooter>
        <Button kind="secondary" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          kind="primary"
          onClick={handleSubmit(onFormSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </ModalFooter>
    </ComposedModal>
  );
};
