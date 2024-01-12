
import { ICheckInRepository } from "@/repositories/check-in-repository";

interface GetUserMetricsUseCaseRequest {
    userId: string;
}

interface GetUserMetricsUseCaseResponse{
    checkInsCount: number
}

export class GetUserMetricsUseCase{
	constructor(
		private checkInRepository: ICheckInRepository) {}

	async execute({
		userId,
	}: GetUserMetricsUseCaseRequest) : Promise <GetUserMetricsUseCaseResponse>{
		const checkInsCount = await this.checkInRepository.countByUserId(userId);


		return{
			checkInsCount,
		};
	}


}