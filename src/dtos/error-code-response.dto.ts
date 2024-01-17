import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { ERROR_CODES } from '../constants/error-codes.constant';

export const AuthCodeResponse = (...codes: string[]) => {
  const descriptionCode = codes
    .map((code) => `\`${code}\`: ${ERROR_CODES.get(code)}`)
    .join('\n\n');

  return applyDecorators(
    ApiUnauthorizedResponse({
      schema: {
        title: `ErrorCode`,
        properties: {
          code: {
            type: 'string',
            example: codes[0],
          },
          message: {
            type: 'string',
            example: ERROR_CODES.get(codes[0]),
          },
        },
      },
      description: `List of ErrorCode: 
      \n\n${descriptionCode}`,
    }),
  );
};

export const ErrorCodeResponse = (...codes: string[]) => {
  const descriptionCode = codes
    .map((code) => `\`${code}\`: ${ERROR_CODES.get(code)}`)
    .join('\n\n');

  return applyDecorators(
    ApiBadRequestResponse({
      schema: {
        title: `ErrorCode`,
        properties: {
          code: {
            type: 'string',
            example: codes[0],
          },
          message: {
            type: 'string',
            example: ERROR_CODES.get(codes[0]),
          },
        },
      },
      description: `List of ErrorCode: 
      \n\n${descriptionCode}`,
    }),
  );
};
