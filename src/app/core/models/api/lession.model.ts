import { AssignmentResponse } from './assignment.model';
import { DocumentResponse } from './document.model';

interface LessionResponse {
    id: string;
    name: string;
    assignments?: AssignmentResponse[];
    documents?: DocumentResponse[];
}
export type { LessionResponse };
