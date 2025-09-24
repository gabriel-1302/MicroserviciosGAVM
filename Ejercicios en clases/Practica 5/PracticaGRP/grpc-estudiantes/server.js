import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const PROTO_PATH = "./proto/estudiantes.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const proto = grpc.loadPackageDefinition(packageDefinition).estudiantes;

// Base de datos en memoria
const estudiantes = [];
const cursos = [];
const inscripciones = []; // { ci_estudiante, codigo_curso }

const serviceImpl = {
    AgregarEstudiante: (call, callback) => {
        const nuevoEstudiante = call.request;
        estudiantes.push(nuevoEstudiante);
        console.log("Estudiante agregado:", nuevoEstudiante);
        callback(null, { estudiante: nuevoEstudiante });
    },
    ObtenerEstudiante: (call, callback) => {
        const { ci } = call.request;
        const estudiante = estudiantes.find(e => e.ci === ci);
        if (estudiante) {
            callback(null, { estudiante });
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                message: "Estudiante no encontrado"
            });
        }
    },
    ListarEstudiantes: (_, callback) => {
        callback(null, { estudiantes });
    },
    AgregarCurso: (call, callback) => {
        const nuevoCurso = call.request;
        cursos.push(nuevoCurso);
        console.log("Curso agregado:", nuevoCurso);
        callback(null, { curso: nuevoCurso });
    },
    InscribirEstudiante: (call, callback) => {
        const { ci_estudiante, codigo_curso } = call.request;
        const estudiante = estudiantes.find(e => e.ci === ci_estudiante);
        const curso = cursos.find(c => c.codigo === codigo_curso);

        if (!estudiante || !curso) {
            return callback({
                code: grpc.status.NOT_FOUND,
                message: "Estudiante o curso no encontrado."
            });
        }

        const yaInscrito = inscripciones.some(
            i => i.ci_estudiante === ci_estudiante && i.codigo_curso === codigo_curso
        );

        if (yaInscrito) {
            return callback({
                code: grpc.status.ALREADY_EXISTS,
                message: "El estudiante ya está inscrito en este curso."
            });
        }

        inscripciones.push({ ci_estudiante, codigo_curso });
        console.log(`Estudiante ${ci_estudiante} inscrito en curso ${codigo_curso}`);
        callback(null, { mensaje: "Inscripción exitosa." });
    },
    ListarCursosDeEstudiante: (call, callback) => {
        const { ci } = call.request;
        const cursosInscritos = inscripciones
            .filter(i => i.ci_estudiante === ci)
            .map(i => cursos.find(c => c.codigo === i.codigo_curso));
        callback(null, { cursos: cursosInscritos });
    },
    ListarEstudiantesDeCurso: (call, callback) => {
        const { codigo } = call.request;
        const estudiantesInscritos = inscripciones
            .filter(i => i.codigo_curso === codigo)
            .map(i => estudiantes.find(e => e.ci === i.ci_estudiante));
        callback(null, { estudiantes: estudiantesInscritos });
    }
};

const server = new grpc.Server();
server.addService(proto.EstudianteService.service, serviceImpl);

const PORT = "50051";
server.bindAsync(
    `0.0.0.0:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, bindPort) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`Servidor gRPC escuchando en ${bindPort}`);
        server.start();
    }
);
