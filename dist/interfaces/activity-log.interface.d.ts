import { BaseEntity } from './base.interface';
export interface IActivityLog extends BaseEntity {
    orgId: string;
    userId: string;
    entityType: string;
    entityId: string;
    action: string;
    metadata: Record<string, any> | null;
}
export type CreateActivityLogDto = Omit<IActivityLog, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'expiredAt'>;
