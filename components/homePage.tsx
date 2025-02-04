import React from "react";

export function HomePage() {
  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            BIENVENIDOS A SASHA
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Soluciones innovadoras para la industria petrolera
          </p>
        </div>

        {/* Valores Corporativos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-4 transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-center mb-6 gap-8">
            <h3 className="text-xl font-semibold text-gray-900 ">VISIÓN</h3>
            <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center ">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            </div>
            <p className="text-gray-600 text-justify">
              Ser una empresa confiable y modelo en servicios petroleros, reconocida por su compromiso con la calidad, 
              la innovación y la satisfacción de sus clientes, aportando soluciones que excedan las expectativas del sector.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 transform transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-center mb-6 gap-8">
          <h3 className="text-xl font-semibold text-gray-900 ">MISIÓN</h3>
            <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center ">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            
            </div>
            <p className="text-gray-600">
              Proporcionar servicios y soluciones integrales de alta calidad para la industria petrolera, 
              garantizando la excelencia operativa y el desarrollo sostenible.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 transform transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-center mb-6 gap-8">
          <h3 className="text-xl font-semibold text-gray-900 ">VALORES</h3>
            <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center ">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            
            </div>
            <p className="text-gray-600">
              Integridad, excelencia, innovación y compromiso son los pilares fundamentales 
              que guían nuestras operaciones y relaciones comerciales.
            </p>
          </div>
        </div>

        {/* Últimos Ingresos Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Últimos Ingresos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Aquí puedes agregar los últimos ingresos dinámicamente */}
          </div>
        </div>
      </div>
    </div>
  );
}