import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-check-in-repository";
import { ValidateCheckInUseCase } from "../validate-check-in";

export function makeValidateCheckInsUseCase(){
    
	const checkInRepository = new PrismaCheckInRepository;
	const useCase = new ValidateCheckInUseCase(checkInRepository);

	return useCase;
}