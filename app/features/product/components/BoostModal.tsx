import {
  ComposedModal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Button,
} from "@carbon/react";
import { useState, useEffect } from "react";
import { useGetBoostPricing, useCreateBoost, useUpdateBoost, useCancelBoost } from "../../boost/hooks";
import { BoostPricing, Boost } from "@/app/types";

interface BoostModalProps {
  open: boolean;
  onClose: () => void;
  itemType: 'product' | 'vehicle';
  itemId: number;
  itemName: string;
  existingBoost?: Boost | null;
}

export const BoostModal = ({
  open,
  onClose,
  itemType,
  itemId,
  itemName,
  existingBoost,
}: BoostModalProps) => {
  const isEditMode = !!existingBoost;
  const [selectedBoostType, setSelectedBoostType] = useState<'premium' | 'featured' | 'top'>('premium');
  const [selectedDuration, setSelectedDuration] = useState<number>(24);

  const { data: pricing, isLoading: isLoadingPricing } = useGetBoostPricing();
  const createBoostMutation = useCreateBoost();
  const updateBoostMutation = useUpdateBoost();
  const cancelBoostMutation = useCancelBoost();

  // Initialize form with existing boost data if editing
  useEffect(() => {
    if (existingBoost) {
      setSelectedBoostType(existingBoost.boost_type);
      setSelectedDuration(existingBoost.duration_hours);
    } else {
      setSelectedBoostType('premium');
      setSelectedDuration(24);
    }
  }, [existingBoost, open]);

  const handleSubmit = async () => {
    try {
      if (isEditMode && existingBoost) {
        await updateBoostMutation.mutateAsync({
          id: existingBoost.id,
          data: {
            boost_type: selectedBoostType,
            duration_hours: selectedDuration,
          },
        });
      } else {
        await createBoostMutation.mutateAsync({
          item_type: itemType,
          item_id: itemId,
          boost_type: selectedBoostType,
          duration_hours: selectedDuration,
        });
      }
      onClose();
      // Reset state
      setSelectedBoostType('premium');
      setSelectedDuration(24);
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} boost:`, error);
    }
  };

  const handleRemoveBoost = async () => {
    if (!existingBoost) return;
    
    try {
      await cancelBoostMutation.mutateAsync(existingBoost.id);
      onClose();
      // Reset state
      setSelectedBoostType('premium');
      setSelectedDuration(24);
    } catch (error) {
      console.error('Failed to remove boost:', error);
    }
  };

  const getCost = () => {
    if (!pricing) return 0;
    return pricing[selectedBoostType]?.[selectedDuration] || 0;
  };

  const availableDurations = pricing ? Object.keys(pricing[selectedBoostType] || {}).map(Number) : [];

  const isLoading = createBoostMutation.isPending || updateBoostMutation.isPending || cancelBoostMutation.isPending;

  return (
    <ComposedModal open={open} onClose={onClose} size="sm">
      <ModalHeader>
        <h3>{isEditMode ? 'Edit' : 'Boost'} {itemType === 'product' ? 'Product' : 'Vehicle'}</h3>
        <p>{itemName}</p>
      </ModalHeader>
      <ModalBody>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Boost Type</label>
            <Select
              id="boost-type"
              value={selectedBoostType}
              onChange={(e) => setSelectedBoostType(e.target.value as any)}
            >
              <SelectItem value="premium" text="Premium Boost" />
              <SelectItem value="featured" text="Featured Boost" />
              <SelectItem value="top" text="Top Boost" />
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Duration</label>
            <Select
              id="boost-duration"
              value={selectedDuration.toString()}
              onChange={(e) => setSelectedDuration(Number(e.target.value))}
            >
              {availableDurations.map(duration => (
                <SelectItem
                  key={duration}
                  value={duration.toString()}
                  text={`${duration} hours`}
                />
              ))}
            </Select>
          </div>

          <div className="p-4 rounded border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Cost:</span>
              <span className="text-lg font-bold">₱{getCost()}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {isEditMode 
                ? 'Boost will be updated and restarted with new settings.'
                : 'Boost will be activated immediately upon confirmation.'}
            </p>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        {isEditMode && (
          <Button 
            kind="danger" 
            onClick={handleRemoveBoost}
            disabled={isLoading}
          >
            {cancelBoostMutation.isPending ? 'Removing...' : 'Remove Boost'}
          </Button>
        )}
        <Button kind="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading 
            ? (isEditMode ? 'Updating...' : 'Creating...') 
            : (isEditMode ? 'Update Boost' : 'Boost Now')}
        </Button>
      </ModalFooter>
    </ComposedModal>
  );
};