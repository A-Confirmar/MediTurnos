// Tipos para la API de Georef (datos.gob.ar)

export interface Provincia {
  id: string;
  nombre: string;
}

export interface Localidad {
  id: string;
  nombre: string;
  provincia: {
    id: string;
    nombre: string;
  };
}

export interface ProvinciasResponse {
  provincias: Provincia[];
  cantidad: number;
  total: number;
  inicio: number;
  parametros: Record<string, unknown>;
}

export interface LocalidadesResponse {
  localidades: Localidad[];
  cantidad: number;
  total: number;
  inicio: number;
  parametros: Record<string, unknown>;
}
