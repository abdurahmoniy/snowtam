import { useMutation } from '@tanstack/react-query';
import { createRunwayCondition } from '@/services/runway-condition.services';
import { RunwayConditionCreateRequest, RunwayConditionCreateResponse } from '@/types/runway-condition';

export function useCreateRunwayCondition() {
  return useMutation<RunwayConditionCreateResponse, Error, RunwayConditionCreateRequest>({
    mutationFn: createRunwayCondition,
  });
} 