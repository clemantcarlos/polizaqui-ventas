  // Definición de la interfaz
  export interface ErrorCode {
      code: string;
      description: string;
    }
    
    // Datos de error definidos como una constante
    export const ERROR_CODES: ErrorCode[] = [
      { "code": "AB01", "description": "Proceso cancelado debido al tiempo de espera." },
      { "code": "MD09", "description": "El cliente acreedor se encuentra en estado inactivo en la lista del cliente deudor" },
      { "code": "AG01", "description": "Transacción restringida en este tipo de cuenta" },
      { "code": "RJCT", "description": "Operación Rechazada" },
      { "code": "AB07", "description": "El agente del mensaje no está en línea." },
      { "code": "REJT", "description": "Solicitud de Liquidación Lipone Rechazada" },
      { "code": "PRCS", "description": "Liquidación Lipone Procesada" },
      { "code": "MD01", "description": "El cliente acreedor no esta afiliado por el cliente deudor" },
      { "code": "BE01", "description": "Datos del cliente emisor o receptor no se corresponden" },
      { "code": "CUST", "description": "Cancelación solicitada por el deudor" },
      { "code": "RC08", "description": "Código del Banco no existe en el sistema de compensación /Liquidación." },
      { "code": "AM05", "description": "Operación duplicada" },
      { "code": "WAIT", "description": "Operación en espera de validación de Código" },
      { "code": "TM01", "description": "Mensaje enviado fuera del horario establecido" },
      { "code": "VE01", "description": "Rechazo Técnico." },
      { "code": "AM02", "description": "El monto de la transacción no cumple con el acuerdo establecido (De acuerdo a lo indicado en aclaratoria funcional vigente)" },
      { "code": "TKCM", "description": "Código único de operación de aceptación de débito incorrecto." },
      { "code": "AC04", "description": "El número de cuenta se encuentra cancelado por parte del Banco Receptor." },
      { "code": "FF05", "description": "El Código del producto es invalido o no existe." },
      { "code": "DU01", "description": "La Identificación de mensaje está duplicada." },
      { "code": "AC01", "description": "El número de cuenta no es válido o falta." },
      { "code": "MD15", "description": "Cantidad a cobrar supera el monto establecido por el cliente deudor" },
      { "code": "DS02", "description": "Operación cancelada por usuario autorizado" },
      { "code": "FF07", "description": "El Código del subproducto es invalido o no existe." },
      { "code": "MD22", "description": "El cliente acreedor se encuentra suspendido por el cliente deudor" },
      { "code": "AC06", "description": "La cuenta especificada está bloqueada." },
      { "code": "MD21", "description": "Transacción a cobrar por el acreedor no cumple con los parámetros establecidos por el deudor" },
      { "code": "AM03", "description": "El monto especificado se encuentra en una moneda no definida en los acuerdos establecidos" },
      { "code": "BE20", "description": "La longitud del nombre supera el máximo permitido." },
      { "code": "AG10", "description": "El agente de mensaje está suspendido del sistema de pago nacional." },
      { "code": "AC00", "description": "Operación en Espera de Respuesta del Receptor" },
      { "code": "AM04", "description": "Fondo insuficiente, no puede cubrir el monto especificado en el mensaje." },
      { "code": "TECH", "description": "Error Técnico al Procesar Liquidación" },
      { "code": "AC09", "description": "Moneda no válida o no existe." },
      { "code": "CH20", "description": "Número de decimales supera el máximo permitido." },
      { "code": "DT03", "description": "Fecha de procesamiento no bancaria o no válida" },
      { "code": "AG09", "description": "Pago no recibido" },
      { "code": "ACCP", "description": "Operación Aceptada" },
      { "code": "ED05", "description": "La transacción de liquidación ha fallado (Solo para ser utilizado por el administrador del SNP)" },
      { "code": "CANC", "description": "Operación cancelada por el usuario." },
      { "code": "PROC", "description": "Operación en proceso." },
      { "code": "PEND", "description": "Operación en estatus pendiente." },
      { "code": "RAND", "description": "Rechazo aleatorio generado por el simulador" }
    ];
    