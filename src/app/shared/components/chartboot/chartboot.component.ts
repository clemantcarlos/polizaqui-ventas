import { Component, inject, OnInit } from '@angular/core';
import { NlpService } from 'src/app/services/nlp.service';
declare var emailjs: any;

@Component({
  selector: 'app-chartboot',
  templateUrl: './chartboot.component.html',
  styleUrls: ['./chartboot.component.scss'],
})
export class ChartbootComponent  implements OnInit {

  isChatOpen = false;
  userQuestion = '';
  chatMessages: string[] = []; 
  private nlpService = inject(NlpService)
  user_email = 'empsyinternacional.2024@gmail.com';
  public opciones: any = [
    {
      label:'Monto tasa',
      value:'Los bolivares se calculan a como esta la tasa del dia en el Banco central de venezuela (BCV)'
    },
    {
      label:'Servicio de Grua',
      value:'en PolizAqui cuentas con servicio de grua para RCV, para solicitar el servicio contacta al siguiente numero +58()'
    },
    {
      label:'Patologia',
      value:'El gasto de patologias varia segun los terminos de la poliza y la aseguradora es recomendable revisar los términos específicos de la póliza para conocer los detalles.'
    },
    {
      label:'Tiempo de espera',
      value:'En las pólizas, es común que existan plazos de espera. Estos plazos se refieren al tiempo que debe transcurrir desde la contratación de la póliza hasta que se pueda acceder a ciertos beneficios o coberturas. Los plazos de espera varían según la aseguradora y el tipo de cobertura, por lo que es recomendable revisar los términos específicos de la póliza para conocer los detalles.'
    },
    {
      label:'Defensa Penal',
      value:'En pólizas de Responsabilidad Civil Vehicular (RCV), la defensa penal cubre los gastos relacionados con la representación legal y otros costos asociados a la defensa penal en caso de un accidente. Sin embargo, el monto de cobertura puede variar según la aseguradora y las condiciones de la póliza específica'
    },
    {
      label:'Atención al cliente',
      value:'PolizAqui cuenta con atención las 24 horas del dia y los 365 dias del año, incluyendo dias feriados y no laborables, para comunicarte dirigite al correo: info@polizaqui.com'
    },
    {
      label:'Cobertura Nacional',
      value:'Nuestro sistema de polizas incluye conbertura dentro del territorio nacional'
    },
    {
      label:'Renovación',
      value:'las pólizas no se renuevan automáticamente en PolizAqui. El usuario debe ingresar nuevamente a la plataforma y realizar la compra para el nuevo período.'
    },
    {
      label:'Cancelacion',
      value:'Las pólizas de PolizAqui no pueden cancelarse ni se ofrecen reembolsos una vez compradas.'
    },
    {
      label:'Caso de accidente',
      value:'Debes notificar al asegurador lo antes posible y proporcionar los documentos requeridos para el procesamiento de la reclamación.'
    },
    {
      label:'Caso de Fallecimiento',
      value:'Sí, el seguro de vida cubre el fallecimiento por cualquier causa, incluyendo muerte accidental​'
    },
    {
      label:'Retraso poliza',
      value:'Si no puedes pagar tu prima en la fecha acordada, dispones de un plazo de gracia para realizar el pago.\n'+' Si ocurre un siniestro durante este plazo, la indemnización se pagará una vez hayas completado el pago de la prima.'
    },
    {
      label:'Reembolso',
      value:'las pólizas no son reembolsables una vez adquiridas.'
    },
    {
      label:'Error de documento',
      value:'Prueba escaneando sin reflejo de luz en la imagen. \n'+ 'Verifica la conexión de tu internet. \n' + 'Verifica que los documentos a cargar sean los correspondientes. \n' + 'Intenta mas tarde'
    },
    {
      label:'OCR',
      value:'Es una tecnología que lee y valida los documentos automáticamente'
    },
    {
      label:'Documentos necesarios',
      value:'RCV: Cédula de identidad, licencia de conducir, y carnet de circulación.\n' +
             'Funerario: Solo la cédula de identidad.\n' +
             'Vida: Cédula de identidad del asegurado y datos de los beneficiarios.'
    },
    {
      label:'Precio de planes',
      value:'PolizAqui ya ofrece los planes más económicos disponibles.'
    },
    {
      label:'Metodo de pagó',
      value:'Aceptamos transferencia bancaria y pago móvil en bolívares directamente desde la plataforma.'
    },
    {
      label:'Punto de venta',
      value:'En lugares como talleres, gimnasios, funerarias, restaurantes, y donde consigas el símbolo de PolizAqui para escanear el código QR.'
    },
    {
      label:'Que es PolizAqui',
      value:'Es una plataforma que te permite comprar seguros de manera rápida y sencilla.'
    },
    {
      label:'Opcion Compra',
      value:'Escaneas el QR, eliges el seguro, subes tus documentos y pagas en línea.'
    },
    {
      label:'Generar poliza',
      value:'Te llega a tu correo electrónico y puedes descargarla desde tu teléfono.'
    },
    {
      label:'Escaneo',
      value:'Usas la cámara de tu móvil para escanear el QR en los puntos de venta.'
    },{
      label:'Problema con la poliza',
      value:'Si tienes algún problema con tu compra en PolizAqui, puedes contactarnos a través de nuestro soporte en la plataforma o enviarnos un correo electrónico a info@polizaqui.com. Te brindaremos asistencia inmediata para resolver cualquier inconveniente.'
    },
    {
      label:'Personas',
      value:'Sí, en PolizAqui puedes comprar un seguro para otra persona. Solo necesitas proporcionar los datos y documentos requeridos de la persona que será asegurada durante el proceso de compra. Una vez completado, la póliza se enviará al correo electrónico que indiques.'
    },
    {
      label:'Falla de poliza',
      value:'Si no puedes escanear el código QR con tu móvil, puedes intentar lo siguiente:Verifica que la cámara esté enfocando correctamente el código QR.Asegúrate de tener una buena iluminación.Si sigues teniendo problemas, puedes ingresar manualmente a la plataforma usando el enlace proporcionado en el punto de venta.Si necesitas más ayuda, contáctanos a través de info@polizaqui.com y te guiaremos para completar el proceso.'
    },
    {
      label:'documentos invalidos',
      value:'Si tus documentos no son validados en PolizAqui, recibirás una notificación explicando el motivo del rechazo. En ese caso, podrás volver a subir los documentos correctos para completar el proceso. Si necesitas ayuda para entender el problema o tienes dificultades al subirlos, puedes contactarnos a través de info@polizaqui.com y te asistiremos para resolverlo lo antes posible.'
    },
    {
      label:'Dispositivo',
      value:'Sí, puedes usar cualquier dispositivo móvil que tenga una cámara funcional y acceso a internet para escanear el código QR y comprar un seguro en PolizAqui. Solo necesitas que el dispositivo tenga la capacidad de leer códigos QR, lo cual es posible con la mayoría de los smartphones y tablets actuales. Si tienes algún problema con el escaneo, también puedes acceder al enlace manualmente o contactarnos para recibir asistencia.'
    },
    {
      label:'Tiempo',
      value:'Después de elegir un seguro en PolizAqui, debes completar el proceso subiendo los documentos de manera obligatoria para finalizar la compra. No podrás completar la transacción ni recibir tu póliza hasta que todos los documentos requeridos sean cargados correctamente. Si tienes alguna duda o problema con la carga de los documentos, puedes contactarnos a través de info@polizaqui.com  para recibir asistencia.'
    },
    {
      label:'RCV',
      value:'El seguro de RCV no cubre los daños causados al vehículo del asegurado ni lesiones a los ocupantes del mismo. Tampoco cubre pérdidas o daños causados por guerra, radiaciones nucleares, confiscación por autoridades gubernamentales, entre otros​'
    },
    {
      label:'Daños de rcv',
      value:'El seguro de RCV solo cubre los daños ocasionados a terceros. No cubre los daños a tu propio vehículo'
    },
    {
      label:'Adicionales',
      value:'No, RCV solo cubre daños ocasionados a terceros por el asegurado.'
    },
    {
      label:'caso de muerte',
      value:'Sí, el seguro de vida cubre el fallecimiento por cualquier causa, incluyendo muerte accidental'
    },
    {
      label:'beneficiarios',
      value:'Los beneficiarios son designados por el asegurado en el momento de contratar la póliza y tienen derecho a recibir el pago de la indemnización en caso de fallecimiento del asegurado'
    },
    {
      label:'coberturas funerarias',
      value:'El seguro funerario cubre los gastos por servicios funerarios en caso de fallecimiento del asegurado, hasta el límite de la suma asegurada\n\n​'+'el seguro funerario cubre los gastos relacionados con servicios funerarios, como entierro o cremación dentro del territoria nacional'
    },
    {
      label:'Riesgo',
      value:'El seguro de accidentes personales cubre los riesgos relacionados con accidentes que resulten en lesiones físicas al asegurado, según lo indicado en las Condiciones Particulares y los Anexos. El asegurador indemnizará al asegurado o a sus beneficiarios por el monto asegurado en caso de que ocurra un accidente durante la vigencia de la póliza​'
    },
    {
      label:'Cobertura maxima',
      value:'El monto máximo de cobertura dependerá de lo estipulado en el Cuadro Póliza Recibo, el cual debe indicar la suma asegurada. Este monto puede variar según el contrato específico​'
    },
    {
      label:'indemnizaciones',
      value:'Los seguros de accidentes personales solo cubren indemnizaciones en caso de un accidente cubierto que resulte en lesiones físicas,'
    },
    {
      label:'Laboral',
      value:' Si tenemos planes empresariales'
    },
    {
      label:'Aumento',
      value:'Si deseas mejorar tu plan puedes solicitar una cotización a info@polizaqui.com'
    },
    {
      label:'tipos de seguros',
      value:'Ofrece seguros de Responsabilidad Civil Vehicular (RCV), funerarios, de vida y de accidentes personales.'
    },
    {
      label:'modificar datos',
      value:'En PolizAqui, una vez que se ha ingresado la información para la compra de una póliza, no es posible modificar los datos antes de realizar el pago. Es importante que los datos ingresados coincidan exactamente con los documentos que estás cargando. Te recomendamos revisar cuidadosamente toda la información antes de confirmar tu compra para asegurarte de que todo esté correcto. Si tienes alguna duda o necesitas asistencia, no dudes en contactarnos.'
    },
    {
      label:'cobertura vida',
      value:'Proporciona una suma asegurada a los beneficiarios en caso de fallecimiento del asegurado, garantizando su estabilidad financiera.'
    },
    {
      label:'saludo',
      value:'¡Hola! 👋 Bienvenido a PolizAqui, donde te ayudamos a proteger lo que más importa. ¿En qué puedo ayudarte hoy?'
    },
    {
      label:'recibi',
      value:'Ingresa a tu cuenta en PolizAqui \n\n'+'Ve a la sección "Mis Pólizas" en el menú. \n\n'+'Ahí podrás ver y descargar tu póliza en cualquier momento.Si necesitas más ayuda, no dudes en contactarnos a info@polizaqui.com'
    }
 ]

 sendEmail(message: string, request: string) {
  const templateParams = {
    to_email: this.user_email,
    message: message,
    request: request
  };

  emailjs.send('service_q4llvxs', 'template_2rq50p8', templateParams)
    .then(function(response: any) {
      console.log('Correo enviado exitosamente!', response.status, response.text);
    }, function(error: any) {
      console.error('Error al enviar el correo:', error);
    });
}

  
  constructor() { }

  ngOnInit() {

  }

  clearChat() {
    this.chatMessages = [];
  }
  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    this.chatMessages = []
    if (this.isChatOpen && this.chatMessages.length === 0) {
      this.chatMessages.push("Bot: Hola, ¿en qué puedo ayudarte?");
    }
  }

  handleUserQuestion() {
    this.chatMessages.push(`Tú: ${this.userQuestion}`);
    
    // Dividir la pregunta del usuario en palabras individuales
    const keywords = this.userQuestion.toLowerCase().split(' ');  // Separar por espacios
    console.log(keywords);  // Verificar palabras clave
  
    const response = this.getResponseForKeywords(keywords);  // Buscar respuesta
    this.chatMessages.push(`Bot: ${response}`);
    this.sendEmail(this.userQuestion,response)
    this.userQuestion = '';
  }
  
  

  synonyms: { [key: string]: string[] } = {
    'Monto tasa': ['tasa'],
    'Servicio de Grua': ['grua'],
    'Patologia': ['patologia'],
    'Tiempo de espera': ['tiempo'],
    'Defensa Penal': ['defensa'],
    'Atención al cliente': ['soporte','atencion','atención'],
    'Cobertura Nacional': ['nacional','territorio','pais','país','país?','pais'],
    'Renovación': ['renocavion'],
    'Cancelacion': ['cancelacion'],
    'Caso de accidente': ['accidente'],
    'Caso de Fallecimiento': ['fallecimiento'],
    'Retraso poliza': ['retraso','prima'],
    'Reembolso': ['reembolso','rembolso'],
    'Error de documento': ['falla','reconoce'],
    'OCR': ['ocr'],
    'Documentos necesarios': ['necesarios'],
    'Precio de planes': ['planes','descuento','descuentos','cuesta','precio'],
    'Metodo de pagó': ['metodo','cuentas','modena','extranjera','zelle','bancolombia','paypal','bitcoin','criptomonedas','criptomoneda','zinli','dolares','pesos','transferencia','bolivares','transferencias','pagar'],
    'Punto de venta': ['consigo','venta','punto','puntos'],
    'Que es PolizAqui': ['polizaqui','polizaqui?'],
    'Opcion Compra': ['compro','adquirir','adquiero','compra','pago'],
    'Generar poliza': ['genero','descargo'],
    'Escaneo': ['escaneo','qr'],
    'Problema con la poliza': ['problema','fallo','asistencia','recibo','realizar','pague','reclamo','error','reportar','emergencia'],
    'Personas': ['personas','persona','familiar','familiares','contratar'],
    'Falla de poliza': ['codigo','escanear'],
    'documentos invalidos': ['invalidos','validos','validados'],
    'Dispositivo': ['dispositivo','telefono','aparatos'],
    'Tiempo': ['demora','cargar','subir'],
    'RCV': ['(rcv)?','(rcv)','lesiones'],
    'Daños de rcv':['daños','daño','rcv'],
    'Adicionales':['adicionales','adicional'],
    'caso de muerte':['muerte','vida'],
    'beneficiarios':['beneficiarios'],
    'coberturas funerarias':['funerario','funeraria'],
    'Riesgo':['riesgo','personales','accidentes'],
    'Cobertura maxima':['maxima','aumentar','maximo','máximo'],
    'indemnizaciones':['indemnizaciones','indemnizacion','limitaciones'],
    'Laboral':['laboral','laborales'],
    'Aumento':['mejorar'],
    'tipos de seguros':['seguros'],
    'modificar datos':['modificar'],
    'cobertura vida':['vida','salud','1'],
    "saludo":['hola','tardes','dias','noches','saludo'],
    "recibi":['llego','recibi','llegó']
  };
  
  
  getResponseForKeywords(keywords: string[]): string {
    for (const keyword of keywords) {
      for (const [label, keywordList] of Object.entries(this.synonyms)) {
        if (keywordList.includes(keyword.toLowerCase())) {
          const matchedOption = this.opciones.find((option: any) => option.label.toLowerCase() === label.toLowerCase());
          if (matchedOption) {
            return matchedOption.value;
              
        }
       }
      }
    }
    
    // Si no se encuentra ninguna coincidencia, devuelve una respuesta por defecto
    return "Lo siento, no tengo una respuesta para eso. ¿Puedo ayudarte con otra cosa?";
  }
  
  

}
    

