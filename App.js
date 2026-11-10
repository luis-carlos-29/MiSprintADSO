import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';

export default function App() {
  // HU01: Datos de identidad del aprendiz
  const nombreAprendiz = "Luis Carlos García Sánchez";
  const numeroFicha = "3409609";

  // Estados de la aplicación (HU02 - HU07)
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Análisis');
  const [tareas, setTareas] = useState([]);
  const [mensajeError, setMensajeError] = useState('');

  // Categorías requeridas por HU02
  const categoriasDisponibles = ['Análisis', 'Diseño', 'Código'];

  // HU03 & HU04: Función para registrar nueva tarea con validación
  const agregarTarea = () => {
    // HU04: Rechazar títulos vacíos o compuestos solo por espacios
    if (!titulo.trim()) {
      setMensajeError('Debe ingresar un título para la tarea');
      return;
    }

    // HU03: Estructura de la tarea (nace como Pendiente)
    const nuevaTarea = {
      id: Date.now().toString(),
      titulo: titulo.trim(),
      categoria: categoria,
      completada: false,
    };

    setTareas([...tareas, nuevaTarea]);
    setTitulo(''); // Limpiar el input tras registro exitoso
    setMensajeError('');
  };

  // HU06: Alternar estado entre Pendiente y Completada
  const cambiarEstadoTarea = (id) => {
    setTareas(
      tareas.map((tarea) =>
        tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
      )
    );
  };

  // HU07: Eliminar la tarea seleccionada
  const eliminarTarea = (id) => {
    setTareas(tareas.filter((tarea) => tarea.id !== id));
  };

  // HU08: Indicadores dinámicos del resumen de avance
  const totalTareas = tareas.length;
  const completadas = tareas.filter((t) => t.completada).length;
  const pendientes = totalTareas - completadas;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1976D2" />

      {/* HU01 / RF01: Encabezado de Identidad */}
      <View style={styles.header}>
        <Text style={styles.tituloHeader}>Mi Sprint ADSO</Text>
        <Text style={styles.subtituloHeader}>
          {nombreAprendiz} | Ficha: {numeroFicha}
        </Text>
      </View>

      <View style={styles.contenido}>
        {/* HU08 / RF03: Resumen de Avance */}
        <View style={styles.cajaResumen}>
          <Text style={styles.tituloResumen}>Resumen de Avance</Text>
          <View style={styles.filasResumen}>
            <View style={styles.itemContador}>
              <Text style={styles.numeroContador}>{totalTareas}</Text>
              <Text style={styles.textoContador}>Total</Text>
            </View>
            <View style={styles.itemContador}>
              <Text style={[styles.numeroContador, styles.numPendiente]}>{pendientes}</Text>
              <Text style={styles.textoContador}>Pendientes</Text>
            </View>
            <View style={styles.itemContador}>
              <Text style={[styles.numeroContador, styles.numCompletada]}>{completadas}</Text>
              <Text style={styles.textoContador}>Completadas</Text>
            </View>
          </View>
        </View>

        {/* HU02, HU03, HU04 / RF02: Formulario de Registro */}
        <View style={styles.cajaFormulario}>
          <Text style={styles.labelInput}>Título de la tarea:</Text>
          <TextInput
            style={styles.inputTexto}
            placeholder="Ej. Diseñar prototipo móvil..."
            value={titulo}
            onChangeText={setTitulo}
          />

          <Text style={styles.labelInput}>Categoría:</Text>
          <View style={styles.contenedorBotonesCategoria}>
            {categoriasDisponibles.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.btnCategoria,
                  categoria === cat && styles.btnCategoriaActiva,
                ]}
                onPress={() => setCategoria(cat)}
              >
                <Text
                  style={[
                    styles.txtBtnCategoria,
                    categoria === cat && styles.txtBtnCategoriaActiva,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* HU04: Advertencia visual de validación */}
          {mensajeError !== '' && (
            <Text style={styles.textoError}>{mensajeError}</Text>
          )}

          <TouchableOpacity style={styles.btnAgregar} onPress={agregarTarea}>
            <Text style={styles.txtBtnAgregar}>Agregar tarea</Text>
          </TouchableOpacity>
        </View>

        {/* HU05, HU06, HU07 / RF02: Tablero de Tareas con FlatList */}
        <View style={styles.contenedorLista}>
          <Text style={styles.subtituloLista}>Tablero de Tareas</Text>
          <FlatList
            data={tareas}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              /* HU05: Mensaje cuando la lista está vacía */
              <Text style={styles.textoSinTareas}>
                Todavía no hay tareas en tu sprint.
              </Text>
            }
            renderItem={({ item }) => (
              <View
                style={[
                  styles.tarjetaTarea,
                  item.completada && styles.tarjetaCompletada,
                ]}
              >
                <View style={styles.detallesTarea}>
                  <Text
                    style={[
                      styles.tituloTarea,
                      item.completada && styles.textoTachado,
                    ]}
                  >
                    {item.titulo}
                  </Text>
                  <Text style={styles.infoSub}>
                    Categoría: {item.categoria} | Estado:{' '}
                    <Text style={item.completada ? styles.txtVerde : styles.txtNaranja}>
                      {item.completada ? 'Completada' : 'Pendiente'}
                    </Text>
                  </Text>
                </View>

                <View style={styles.botonesAccion}>
                  {/* HU06: Botón para conmutar estado */}
                  <TouchableOpacity
                    style={[
                      styles.btnAccion,
                      item.completada ? styles.btnNaranja : styles.btnVerde,
                    ]}
                    onPress={() => cambiarEstadoTarea(item.id)}
                  >
                    <Text style={styles.txtBotonAccion}>
                      {item.completada ? 'Deshacer' : 'Completar'}
                    </Text>
                  </TouchableOpacity>

                  {/* HU07: Botón para eliminar la tarea */}
                  <TouchableOpacity
                    style={[styles.btnAccion, styles.btnRojo]}
                    onPress={() => eliminarTarea(item.id)}
                  >
                    <Text style={styles.txtBotonAccion}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

// Estilos limpios y organizados
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#1976D2',
    paddingVertical: 14,
    alignItems: 'center',
  },
  tituloHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtituloHeader: {
    fontSize: 12,
    color: '#E3F2FD',
    marginTop: 2,
  },
  contenido: {
    flex: 1,
    padding: 14,
  },
  cajaResumen: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tituloResumen: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  filasResumen: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  itemContador: {
    alignItems: 'center',
  },
  numeroContador: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  numPendiente: {
    color: '#F57C00',
  },
  numCompletada: {
    color: '#388E3C',
  },
  textoContador: {
    fontSize: 12,
    color: '#666',
  },
  cajaFormulario: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  labelInput: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  inputTexto: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  contenedorBotonesCategoria: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 6,
  },
  btnCategoria: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
  },
  btnCategoriaActiva: {
    backgroundColor: '#1976D2',
  },
  txtBtnCategoria: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
  },
  txtBtnCategoriaActiva: {
    color: '#FFFFFF',
  },
  textoError: {
    color: '#D32F2F',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  btnAgregar: {
    backgroundColor: '#388E3C',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
  txtBtnAgregar: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  contenedorLista: {
    flex: 1,
  },
  subtituloLista: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  textoSinTareas: {
    textAlign: 'center',
    color: '#777',
    fontSize: 13,
    marginTop: 15,
  },
  tarjetaTarea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderLeftWidth: 5,
    borderLeftColor: '#F57C00',
  },
  tarjetaCompletada: {
    borderLeftColor: '#388E3C',
    backgroundColor: '#F1F8E9',
  },
  detallesTarea: {
    marginBottom: 6,
  },
  tituloTarea: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  textoTachado: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  infoSub: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  txtNaranja: {
    color: '#F57C00',
    fontWeight: 'bold',
  },
  txtVerde: {
    color: '#388E3C',
    fontWeight: 'bold',
  },
  botonesAccion: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 6,
  },
  btnAccion: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  btnVerde: {
    backgroundColor: '#388E3C',
  },
  btnNaranja: {
    backgroundColor: '#F57C00',
  },
  btnRojo: {
    backgroundColor: '#D32F2F',
  },
  txtBotonAccion: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
});