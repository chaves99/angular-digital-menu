import { Location, NgClass, NgOptimizedImage } from '@angular/common';
import { afterEveryRender, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlansListComponent, ThemeService } from '../../core';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, NgOptimizedImage, PlansListComponent, NgClass],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  pains = [
    { icon: 'bi-calendar2-week', text: 'Preços mudam e o cardápio fica desatualizado' },
    { icon: 'bi-cash-coin', text: 'Gastos constantes com impressão' },
    { icon: 'bi-hourglass-split', text: 'Cliente esperando enquanto o garçom explica o cardápio' },
    { icon: 'bi-exclamation-triangle', text: 'Cardápio rasgado, sujo ou perdido' },
  ];

  steps = [
    { icon: 'bi-pencil-square', title: 'Cadastre', text: 'Adicione produtos, preços, descrições e fotos.' },
    { icon: 'bi-qr-code', title: 'Gere o QR Code', text: 'Imprima uma vez e coloque nas mesas ou no balcão.' },
    { icon: 'bi-phone', title: 'Pronto!', text: 'Seus clientes escaneiam e veem tudo no celular.' },
  ];

  benefits = [
    { icon: 'bi-lightning-charge', title: 'Atualização instantânea', text: 'Mudou o preço? Aparece na hora para todos os clientes.' },
    { icon: 'bi-grid', title: 'Seções organizadas', text: 'Separe alimentos e bebidas em categorias fáceis de navegar.' },
    { icon: 'bi-eye-slash', title: 'Item esgotado?', text: 'Oculte produtos com um clique.' },
    { icon: 'bi-image', title: 'Fotos e descrições', text: 'Deixe seu cardápio atraente e aumente suas vendas.' },
  ];

  faqs = [
    { q: 'Precisa baixar aplicativo?', a: 'Não. Basta ler o QR Code com a câmera do celular.' },
    { q: 'Posso mudar preços quando quiser?', a: 'Sim. Suas mudanças aparecem imediatamente.' },
    { q: 'Funciona em celular antigo?', a: 'Sim.' },
    { q: 'Pode adicionar fotos?', a: 'Sim. Adicione fotos, descrições e preços quando quiser.' },
    { q: 'Posso ter múltiplas categorias?', a: 'Sim. Organize seu menu do jeito que quiser.' },
    { q: 'Como funciona o acesso gratuito?', a: 'Ao se cadastrar você ganha 20 dias para usar gratuitamente, sem cadastrar cartão. Ao final desse período você ainda tem acesso à plataforma, porém seus clientes não podem acessar o menu.' },
    { q: 'Como funciona o cancelamento?', a: 'Você pode cancelar quando quiser e continuar usando a plataforma (cadastrar e editar produtos, categorias...). Porém, com a assinatura cancelada, você volta à mesma situação do fim do período gratuito.' },
  ];

  private activatedRoute = inject(ActivatedRoute);
  private location = inject(Location);
  themeSignal = inject(ThemeService).themeSignal;

  constructor() {
    afterEveryRender({
      read: () => {
        this.activatedRoute.fragment.subscribe(f => {
          if (f) {
            this.scrollTo(f);
            const newLocation = this.location.path(false);
            this.location.replaceState(newLocation);
          }
        });
      }
    });
  }

  public scrollTo(ref: string): void {
    const element = document.getElementById(ref);
    if (element) {
      element.scroll
      element.scrollIntoView({ block: 'nearest' });
    }
  }
}
