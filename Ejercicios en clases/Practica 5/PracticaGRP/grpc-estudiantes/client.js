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

const client = new proto.EstudianteService(
    "localhost:50051",
    grpc.credentials.createInsecure()
);

const main = () => {
    const estudiante = { ci: "12345", nombres: "Gabriel", apellidos: "Velasquez", carrera: "CICO" };
    const curso1 = { codigo: "COM-600", nombre: "MicroServicios", docente: "ING. Montellano" };
    const curso2 = { codigo: "SIS-100", nombre: "Base de Datos", docente: "ING. Espinoza" };

    // 1. Agregar Estudiante
    client.AgregarEstudiante(estudiante, (err, response) => {
        if (err) return console.error("Error agregando estudiante:", err);
        console.log("Estudiante agregado:", response.estudiante);

        // 2. Agregar Cursos
        client.AgregarCurso(curso1, (err, response) => {
            if (err) return console.error("Error agregando curso 1:", err);
            console.log("Curso agregado:", response.curso);

            client.AgregarCurso(curso2, (err, response) => {
                if (err) return console.error("Error agregando curso 2:", err);
                console.log("Curso agregado:", response.curso);

                // 3. Inscribir Estudiante en Cursos
                const inscripcion1 = { ci_estudiante: estudiante.ci, codigo_curso: curso1.codigo };
                client.InscribirEstudiante(inscripcion1, (err, response) => {
                    if (err) return console.error("Error inscribiendo en curso 1:", err);
                    console.log(response.mensaje);

                    const inscripcion2 = { ci_estudiante: estudiante.ci, codigo_curso: curso2.codigo };
                    client.InscribirEstudiante(inscripcion2, (err, response) => {
                        if (err) return console.error("Error inscribiendo en curso 2:", err);
                        console.log(response.mensaje);

                        // 4. Listar Cursos del Estudiante
                        client.ListarCursosDeEstudiante({ ci: estudiante.ci }, (err, response) => {
                            if (err) return console.error("Error listando cursos:", err);
                            console.log(`Cursos de ${estudiante.nombres}:`, response.cursos);

                            // 5. Listar Estudiantes del Curso
                            client.ListarEstudiantesDeCurso({ codigo: curso1.codigo }, (err, response) => {
                                if (err) return console.error("Error listando estudiantes:", err);
                                console.log(`Estudiantes en ${curso1.nombre}:`, response.estudiantes);
                            });
                        });
                    });
                });
            });
        });
    });
};

main();
