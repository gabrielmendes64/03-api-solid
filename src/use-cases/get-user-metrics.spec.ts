import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCheckInRepository } from "../repositories/in-memory/in-memory-check-in-repository";
import { GetUserMetricsUseCase } from "./get-user-metrics";


let checkInRepository : InMemoryCheckInRepository;
let sut : GetUserMetricsUseCase;

describe("Get User Metrics Use Case", () => {

	beforeEach(() => {		
		checkInRepository = new InMemoryCheckInRepository();
		sut = new GetUserMetricsUseCase(checkInRepository);
	});

	it("should be able to get check-ins count for metrics",async () => {
	
		await checkInRepository.create({
			user_id: "user-01",
			gym_id: "gym-01"
		});

        
		await checkInRepository.create({
			user_id: "user-01",
			gym_id: "gym-02"
		});

		const { checkInsCount } = await sut.execute({
			userId: "user-01",
		});

		expect(checkInsCount).toEqual(2);
	}); 


});