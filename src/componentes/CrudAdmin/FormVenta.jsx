import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";

export const FormVenta = ({ venta, onClose }) => {
  const esEdicion = !!venta;
  const { register, handleSubmit } = useForm({
    defaultValues: venta
      ? {
          direccionCompra: venta.direccionCompra,
          valorCompra: venta.valorCompra,
          fechaCompra: venta.fechaCompra,
        }
      : {},
  });

  const onSubmit = async (data) => {
    const payload = {
      direccionCompra: data.direccionCompra,
      valorCompra: Number(data.valorCompra),
      fechaCompra: data.fechaCompra,
      despachoGenerado: venta?.despachoGenerado ?? false,
    };

    try {
      if (esEdicion) {
        await axios.put(`/api/v1/ventas/${venta.idVenta}`, payload, {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        await axios.post("/api/v1/ventas", payload, {
          headers: { "Content-Type": "application/json" },
        });
      }
      Swal.fire({
        title: esEdicion ? "Venta actualizada" : "Venta creada",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      onClose();
    } catch (error) {
      console.error(error);
      Swal.fire({ title: "Error", text: "No se pudo guardar la venta", icon: "error" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center text-center px-24 text-xl"
    >
      <div className="mx-auto text-3xl font-bold mb-10 text-teal-600">
        {esEdicion ? "Editar venta" : "Nueva venta"}
      </div>

      <div className="mb-5">
        <label className="block font-bold mb-2">Dirección de compra</label>
        <input
          type="text"
          className="border border-gray-300 rounded-lg block w-full p-1"
          {...register("direccionCompra", { required: true })}
        />
      </div>

      <div className="mb-5">
        <label className="block font-bold mb-2">Valor de compra</label>
        <input
          type="number"
          className="border border-gray-300 rounded-lg block w-full p-1"
          {...register("valorCompra", { required: true })}
        />
      </div>

      <div className="mb-5">
        <label className="block font-bold mb-2">Fecha de compra</label>
        <input
          type="date"
          className="border border-gray-300 rounded-lg block w-full p-1"
          {...register("fechaCompra", { required: true })}
        />
      </div>

      <button
        type="submit"
        className="py-6 px-14 rounded-lg bg-teal-600 text-white font-bold mb-14"
      >
        {esEdicion ? "Guardar cambios" : "Crear venta"}
      </button>
    </form>
  );
};
