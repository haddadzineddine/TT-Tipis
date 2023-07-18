import { HttpStatus } from '@nestjs/common';

export const sendResponse = (
  message: string,
  data: any,
  statusCode: HttpStatus,
) => {
  return {
    statusCode,
    message,
    data,
  };
};
