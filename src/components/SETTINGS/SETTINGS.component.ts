import { NotficationSerService } from './../../services/Notfication-ser.service';
import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-SETTINGS',
  templateUrl: './SETTINGS.component.html',
  styleUrls: ['./SETTINGS.component.css'],
  standalone: true,
  imports: [RouterLink]
})
export class SETTINGSComponent implements OnInit {

  private auth = inject(Auth)
  public Notfication = inject(NotficationSerService);

  async ngOnInit() {
    const uid = this.auth.currentUser?.uid;
if (uid) {
  const storageKey = `Notfiy_${uid}`;
  const savedValue = localStorage.getItem(storageKey);

  if (savedValue !== null) {
    this.Notfication.switchNot.set(JSON.parse(savedValue));
  }
}
  }




  onToggleSwitch() {
    this.Notfication.switchfun();
  }

  CommingSoon() {
    alert("This feature is coming soon! Stay tuned");
  }
}
