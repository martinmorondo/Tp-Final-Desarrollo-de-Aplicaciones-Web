import {
    CallHandler,
    ExecutionContext,
    Injectable,
    InternalServerErrorException,
    NestInterceptor,
} from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import type { ClassConstructor } from 'class-transformer';
import { validate } from 'class-validator';
import { Observable, mergeMap } from 'rxjs';

@Injectable()
export class ValidateResponseInterceptor<T extends object>
    implements NestInterceptor {
    constructor(
        private readonly dtoClass: ClassConstructor<T>,
        private readonly isArray = false,
    ) {}

    intercept(
        _context: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        return next.handle().pipe(
            mergeMap(async (data: unknown) => {
                if (data === null || data === undefined) {
                    return data;
                }

                if (this.isArray) {
                    if (!Array.isArray(data)) {
                        throw new InternalServerErrorException(
                            'La respuesta de la API no tiene el formato esperado.',
                        );
                    }

                    const instances = plainToInstance(
                        this.dtoClass,
                        data,
                    );

                    for (const instance of instances) {
                        const errors = await validate(instance);

                        if (errors.length > 0) {
                            

                            throw new InternalServerErrorException(
                                'La respuesta de la API no cumple con el DTO definido.',
                            );
                        }
                    }

                    return instances;
                }

                if (Array.isArray(data) || typeof data !== 'object') {
                    throw new InternalServerErrorException(
                        'La respuesta de la API no tiene el formato esperado.',
                    );
                }

                const instance = plainToInstance(
                    this.dtoClass,
                    data,
                );

                const errors = await validate(instance);

                if (errors.length > 0) {
                    

                    throw new InternalServerErrorException(
                        'La respuesta de la API no cumple con el DTO definido.',
                    );
                }

                return instance;
            }),
        );
    }
}