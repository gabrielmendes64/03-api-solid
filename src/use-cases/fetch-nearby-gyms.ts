
import { Gym} from "@prisma/client";
import { IGymsRepository } from "@/repositories/gym-repository";

interface FeatchNearbyGymsUseCaseRequest{
    userLatitude: number
    userLongitude: number
}

interface FeatchNearbyGymsUseCaseResponse{
	gyms: Gym[]
}

export class FeatchNearbyGymsUseCase {
	constructor(private gymRepository: IGymsRepository) {}

	async execute({
		userLatitude,
		userLongitude,
	}: FeatchNearbyGymsUseCaseRequest): Promise <FeatchNearbyGymsUseCaseResponse>{
		
    
		const gyms = await this.gymRepository.findManyNearby({
			latitude: userLatitude,
			longitude: userLongitude
		});

		return {gyms};
	}
} 
