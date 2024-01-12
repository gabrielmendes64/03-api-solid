import fastify from "fastify";
import { ZodError } from "zod";
import { env } from "./env";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { userRoutes } from "./http/controllers/user/routes";
import { gymRoutes } from "./http/controllers/gym/routes";
import { checkInRoutes } from "./http/controllers/check-in/routes";

export const app = fastify();

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	cookie: {
		cookieName: "refreshToken",
		signed: false,
	},
	sign: {
		expiresIn: "10m",
	}
});

app.register(fastifyCookie);

app.register(userRoutes);
app.register(gymRoutes);
app.register(checkInRoutes);

app.setErrorHandler((error, _request, reply) => {
	if(error instanceof ZodError){
		return reply.status(400)
			.send({message: "Validation error", issus: error.format()});
	}

	if(env.NODE_ENV != "production"){
		console.error(error);
	}else{
		// TODO
	}

	return reply.status(500).send({message: "Internal server erro"});

});

