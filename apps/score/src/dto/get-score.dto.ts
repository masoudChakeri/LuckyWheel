import { Expose } from "class-transformer";

export class GetScoreResponse {
    @Expose()
    total_score: number;
}
