import { CreateGymUseCase } from "../create-gym";
import { PrismaGymRepository } from "@/repositories/prisma/prisma-gym-repository";

export function makeCreateGymUseCase(){
    
	const gymInRepository = new PrismaGymRepository;
	const useCase = new CreateGymUseCase(gymInRepository);

	return useCase;
}