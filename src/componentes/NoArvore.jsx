
import React from 'react';
import { motion } from 'framer-motion';

export const NoArvore = ({ no, x, y, nosDestacados, caminhoBusca, nivel }) => {
  const estaDestacado = nosDestacados.includes(no.valor);
  const estaNoCaminho = caminhoBusca.includes(no.valor);

  let fillClass = "fill-indigo-500";
  if (estaDestacado) {
    fillClass = "fill-emerald-500";
  } else if (estaNoCaminho) {
    fillClass = "fill-amber-500";
  }

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.4, delay: nivel * 0.08, ease: "backOut" }}
      className="drop-shadow-lg"
    >
      <motion.circle
        cx={x}
        cy={y}
        r="24"
        strokeWidth="2"
        className={`stroke-slate-300 transition-colors duration-300 ${fillClass}`}
        animate={{ scale: estaDestacado ? 1.15 : 1 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 15 }}
      />
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        className="fill-white text-sm font-bold select-none"
      >
        {no.valor}
      </text>
    </motion.g>
  );
};
