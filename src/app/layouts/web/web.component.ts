import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { HeaderComponent } from '../../components/web/header/header.component';
// import { FooterComponent } from '../../components/web/footer/footer.component';

@Component({
  selector: 'web-layout',
  imports: [RouterOutlet],
  templateUrl: './web.component.html',
  styleUrl: './web.component.scss'
})
export class WebLayout {

}
