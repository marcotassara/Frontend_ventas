import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { FormDespacho } from "./FormDespacho";
import { FormVenta } from "./FormVenta";
import axios from "axios";
import Swal from "sweetalert2";

export const TableCompras = () => {
  const [ventas, setVentas] = useState([]);
  const [openModalDespacho, setOpenModalDespacho] = useState(false);
  const [openModalVenta, setOpenModalVenta] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  const compras = async () => {
    await axios
      .get("/api/v1/ventas", {
        headers: { "Content-Type": "application/json", Accept: "application/json" },
      })
      .then((response) => setVentas(response.data));
  };

  useEffect(() => {
    compras();
  }, []);

  const handleEliminar = async (idVenta) => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar venta?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!confirmacion.isConfirmed) return;

    try {
      await axios.delete(`/api/v1/ventas/${idVenta}`);
      Swal.fire({ title: "Eliminada", icon: "success", confirmButtonText: "Aceptar" });
      compras();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <section className="grid text-center grid-cols-12 mb-8">
        <div className="col-span-12 flex justify-center">
          <div className="col-span-10 p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-white h-full overflow-hidden">

            <div className="flex justify-end mb-4 px-4">
              <button
                onClick={() => { setVentaSeleccionada(null); setOpenModalVenta(true); }}
                className="py-2 px-6 bg-teal-600 text-white rounded-xl shadow-md hover:bg-teal-700 transition-all duration-300"
              >
                + Nueva venta
              </button>
            </div>

            <table className="table-fixed w-full">
              <thead>
                <tr className="py-10">
                  <th className="pr-10">Orden de compra</th>
                  <th className="pr-10">Dirección</th>
                  <th className="pr-10">Fecha de compra</th>
                  <th className="pr-10">Valor total</th>
                  <th className="pr-10">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventas
                  .filter((venta) => !venta.despachoGenerado)
                  .map((venta) => (
                    <tr key={venta.idVenta}>
                      <td className="pr-10 py-4">{venta.idVenta}</td>
                      <td className="pr-10 py-4">{venta.direccionCompra}</td>
                      <td className="pr-10 py-4">{venta.fechaCompra}</td>
                      <td className="pr-10 py-4">${venta.valorCompra}</td>
                      <td className="pr-10 py-4 flex gap-2 justify-center">
                        <button
                          onClick={() => { setVentaSeleccionada(venta); setOpenModalDespacho(true); }}
                          className="py-1 bg-orange-200 px-4 rounded-xl shadow-md hover:bg-orange-300/70 transition-all duration-300"
                        >
                          Generar despacho
                        </button>
                        <button
                          onClick={() => { setVentaSeleccionada(venta); setOpenModalVenta(true); }}
                          className="py-1 bg-blue-200 px-4 rounded-xl shadow-md hover:bg-blue-300/70 transition-all duration-300"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(venta.idVenta)}
                          className="py-1 bg-red-200 px-4 rounded-xl shadow-md hover:bg-red-300/70 transition-all duration-300"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Modal onClose={() => setOpenModalDespacho(false)} open={openModalDespacho}>
        {ventaSeleccionada && (
          <FormDespacho
            venta={ventaSeleccionada}
            onClose={() => { setOpenModalDespacho(false); compras(); }}
          />
        )}
      </Modal>

      <Modal onClose={() => setOpenModalVenta(false)} open={openModalVenta}>
        <FormVenta
          venta={ventaSeleccionada}
          onClose={() => { setOpenModalVenta(false); compras(); }}
        />
      </Modal>
    </>
  );
};
