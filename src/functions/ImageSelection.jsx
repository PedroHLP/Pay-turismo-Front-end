import redImage from '../assets/red.png';
import orangeImage from '../assets/orange.png';
import greenImage from '../assets/green.png';
import greenRunningImage from '../assets/green-running.png';
import greeSlow from '../assets/green-slow.png';

const RobotImage = getStatusImage;

function getStatusImage(statusAutomacao) {
    switch (statusAutomacao) {
      case 'NOK':
        return redImage;
      case 'Processando':
        return orangeImage;
      case 'OK':
        return greenImage;
      case 'OKR':
        return greenRunningImage;
      case 'OKL':
        return greeSlow;
      default:
        return null; // Nenhuma imagem padrão
    }
  }

export default RobotImage;


