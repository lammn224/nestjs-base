import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const PublicApiError = () =>
  applyDecorators(
    ApiBadRequestResponse({
      description: 'Bad request',
    }) as MethodDecorator & ClassDecorator,
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
    }) as MethodDecorator & ClassDecorator,
  );

export const AuthApiError = () =>
  applyDecorators(
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }) as MethodDecorator & ClassDecorator,
    ApiForbiddenResponse({
      description: 'Forbidden',
    }) as MethodDecorator & ClassDecorator,
    ApiBadRequestResponse({
      description: 'Bad request',
    }) as MethodDecorator & ClassDecorator,
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
    }) as MethodDecorator & ClassDecorator,
  );
