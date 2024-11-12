import { validate, v1 } from 'uuid';

export const validateUUID = (uuidInput: string): boolean => {
  return validate(uuidInput);
};

export const generateRandomUUID = () => v1();
