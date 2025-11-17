import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import logoImage from '../../assets/icono-MediTurnos.png';

// Estilos del PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottom: '2 solid #1e40af',
    paddingBottom: 10,
    gap: 15,
  },
  logo: {
    width: 50,
    height: 50,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
    marginTop: 15,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: '1 solid #e5e7eb',
  },
  patientInfoContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#374151',
    width: 140,
  },
  infoValue: {
    color: '#4b5563',
    flex: 1,
  },
  contentBox: {
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 15,
  },
  contentText: {
    color: '#1f2937',
    lineHeight: 1.6,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: '1 solid #e5e7eb',
    paddingTop: 10,
    fontSize: 9,
    color: '#6b7280',
    textAlign: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#9ca3af',
  },
});

interface MedicalHistoryPDFProps {
  patient: {
    name: string;
    lastName: string;
    age?: number;
    email: string;
    phone?: string;
    location?: string;
    birthDate?: string;
  };
  history: {
    diagnostico: string;
    tratamiento: string;
    evolucion?: string;
    fecha_ultima_actualizacion?: string;
  };
  professional: {
    name: string;
    specialty: string;
  };
}

const MedicalHistoryPDF: React.FC<MedicalHistoryPDFProps> = ({ patient, history, professional }) => {
  // Función para formatear la fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No disponible';
    
    try {
      if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
        return dateString;
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image src={logoImage} style={styles.logo} />
          <View style={styles.headerContent}>
            <Text style={styles.title}>MediTurnos - Historia Clínica</Text>
            <Text style={styles.subtitle}>
              Documento generado el {getCurrentDate()}
            </Text>
          </View>
        </View>

        {/* Datos del Profesional */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>Profesional Tratante</Text>
          <View style={styles.patientInfoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nombre:</Text>
              <Text style={styles.infoValue}>{professional.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Especialidad:</Text>
              <Text style={styles.infoValue}>{professional.specialty}</Text>
            </View>
          </View>
        </View>

        {/* Datos del Paciente */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>Datos del Paciente</Text>
          <View style={styles.patientInfoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nombre:</Text>
              <Text style={styles.infoValue}>
                {patient.name} {patient.lastName}
              </Text>
            </View>
            {patient.age && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Edad:</Text>
                <Text style={styles.infoValue}>{patient.age} años</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{patient.email}</Text>
            </View>
            {patient.phone && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Teléfono:</Text>
                <Text style={styles.infoValue}>{patient.phone}</Text>
              </View>
            )}
            {patient.location && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Localidad:</Text>
                <Text style={styles.infoValue}>{patient.location}</Text>
              </View>
            )}
            {patient.birthDate && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Fecha de Nacimiento:</Text>
                <Text style={styles.infoValue}>{patient.birthDate}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Diagnóstico */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>Diagnóstico</Text>
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>{history.diagnostico}</Text>
          </View>
        </View>

        {/* Tratamiento */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>Tratamiento</Text>
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>{history.tratamiento}</Text>
          </View>
        </View>

        {/* Evolución */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>Evolución</Text>
          <View style={styles.contentBox}>
            {history.evolucion && 
             history.evolucion !== 'Completar este campo' && 
             history.evolucion !== 'Sin evolución registrada' ? (
              <Text style={styles.contentText}>{history.evolucion}</Text>
            ) : (
              <Text style={styles.emptyText}>Sin evolución registrada</Text>
            )}
          </View>
        </View>

        {/* Información de actualización */}
        {history.fecha_ultima_actualizacion && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 9, color: '#6b7280' }}>
              Última actualización: {formatDate(history.fecha_ultima_actualizacion)}
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Este documento fue generado por MediTurnos - Sistema de Gestión de Turnos Médicos
          </Text>
          <Text>Documento válido sin firma ni sello</Text>
        </View>
      </Page>
    </Document>
  );
};

export default MedicalHistoryPDF;

