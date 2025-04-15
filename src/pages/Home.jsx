
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
        >
          <span className="block">Juxtapose</span>
          <span className="block text-blue-600">a tu medida</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
        >
          Crea comparaciones visuales impactantes para mostrar el antes y después de tus proyectos.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8"
        >
          <div className="rounded-md shadow">
            <Button
              onClick={() => navigate("/compare")}
              className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
            >
              Comenzar
            </Button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-20"
      >
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Testimonios
        </h2>
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {[
            {
              name: "María García",
              role: "Diseñadora de Interiores",
              content: "Una herramienta esencial para mostrar las transformaciones de mis proyectos."
            },
            {
              name: "Carlos Rodríguez",
              role: "Fotógrafo",
              content: "Perfecta para demostrar el impacto de la post-producción en mis fotografías."
            },
            {
              name: "Ana Martínez",
              role: "Arquitecta",
              content: "Facilita la presentación de renovaciones y remodelaciones a mis clientes."
            }
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
              className="bg-white shadow-lg rounded-lg p-6"
            >
              <p className="text-gray-600 italic">{testimonial.content}</p>
              <div className="mt-4">
                <p className="text-gray-900 font-semibold">{testimonial.name}</p>
                <p className="text-gray-500">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Home;
