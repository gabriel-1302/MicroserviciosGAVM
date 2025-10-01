
import mongoose from 'mongoose';

const trabajadorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  apellido: {
    type: String,
    required: true,
    trim: true
  },
  ci: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  cargo: {
    type: String,
    required: true,
    trim: true
  },
  departamento: {
    type: String,
    required: true,
    trim: true
  },
  fechaIngreso: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: false
});

export default mongoose.model('Trabajador', trabajadorSchema);
