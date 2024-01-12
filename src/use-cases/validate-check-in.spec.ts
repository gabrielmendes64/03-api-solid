import { beforeEach, describe, expect, it, afterEach, vi } from "vitest";
import { InMemoryCheckInRepository } from "../repositories/in-memory/in-memory-check-in-repository";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";


let checkInRepository : InMemoryCheckInRepository;
let sut : ValidateCheckInUseCase;

describe("Validate Check In Use Case", () => {

	beforeEach(async () => {		
		checkInRepository = new InMemoryCheckInRepository();
		sut = new ValidateCheckInUseCase(checkInRepository);

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should be able to validate check in", async () => {
	
		const createdCheckIn = await checkInRepository.create({
			user_id: "user-01",
			gym_id: "gym-01"
		});

		const { checkIn } = await sut.execute({
			checkInId : createdCheckIn.id,
		});


		expect(checkIn.validated_at).toEqual(expect.any(Date));
		expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date));
	}); 

	it("should not be able to validate an inexistent check in", async () => {
	
		await expect(() => 
			sut.execute({
				checkInId: "inexistent-check-in-id"
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
	
	it("should not be able to validate the check-in after 20 minutes of its creation",async () => {
		vi.setSystemTime(new Date(2024, 0, 1, 13, 40));

		const createdCheckIn = await checkInRepository.create({
			user_id: "user-01",
			gym_id: "gym-01"
		});

		const { checkIn } = await sut.execute({
			checkInId : createdCheckIn.id,
		});
		
		const twentyOneMinutosInMs = 1000 * 60 * 21;

		vi.advanceTimersByTime(twentyOneMinutosInMs);

		await expect(() => 
			sut.execute({
				checkInId: checkIn.id
			}),
		).rejects.toBeInstanceOf(Error);
	});
});