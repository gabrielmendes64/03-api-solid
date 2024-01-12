export class LateCheckInValidationError extends Error {
	constructor(){
		super("The check-in can only validated until 20 minutos of its creation");
	}
}