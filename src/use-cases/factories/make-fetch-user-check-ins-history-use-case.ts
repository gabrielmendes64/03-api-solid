import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-check-in-repository";
import { FetchUserCheckInsHistoryUseCase } from "../fetch-user-check-ins-history";

export function makeFetchUserCheckInsHistorysUseCase(){
    
	const checkInRepository = new PrismaCheckInRepository;
	const useCase = new FetchUserCheckInsHistoryUseCase(checkInRepository);

	return useCase;
}