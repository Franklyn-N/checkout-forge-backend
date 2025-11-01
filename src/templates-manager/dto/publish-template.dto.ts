import { IsString, Matches, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PublishTemplateDto {
  @ApiProperty({
    description: 'Version number to publish (e.g., 1.0.0)',
    example: '1.0.0',
    pattern: '^\\d+\\.\\d+\\.\\d+$'
  })
  @IsString()
  @IsNotEmpty({ message: 'Version is required' })
  @Matches(/^\d+\.\d+\.\d+$/, {
    message: 'Version must be in semantic versioning format (e.g., 1.0.0)'
  })
  version: string;
}
