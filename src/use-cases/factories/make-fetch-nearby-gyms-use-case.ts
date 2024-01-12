import { FeatchNearbyGymsUseCase } from "../fetch-nearby-gyms";
import { PrismaGymRepository } from "@/repositories/prisma/prisma-gym-repository";

export function makeFetchNearbyGymsUseCase(){
    
	const gymInRepository = new PrismaGymRepository;
	const useCase = new FeatchNearbyGymsUseCase(gymInRepository);

	return useCase;
}