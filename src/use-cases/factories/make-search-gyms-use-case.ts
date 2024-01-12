import { SearchGymsUseCase } from "../search-gyms";
import { PrismaGymRepository } from "@/repositories/prisma/prisma-gym-repository";

export function makeSearchGymsUseCase(){
    
	const gymInRepository = new PrismaGymRepository;
	const useCase = new SearchGymsUseCase(gymInRepository);

	return useCase;
}