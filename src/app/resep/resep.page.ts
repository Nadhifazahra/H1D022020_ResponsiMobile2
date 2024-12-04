import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-resep',
  templateUrl: './resep.page.html',
  styleUrls: ['./resep.page.scss'],
})
export class ResepPage implements OnInit {
  dataResep: any;
  public selectedId: any;
  router: any;

  constructor(private api:ApiService, private modal:ModalController) { }

  ngOnInit() {
    this.getResep();
  }
  home() {
    this.router.navigateByUrl('/resep');
  }
  
  getResep(){
    this.api.tampil('tampil.php').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.dataResep = res;
      },
      error: (err: any)=> {
        console.log(err);
      }
    })
  }
  modalTambah: any;
  id: any;
  nama: any;
  langkah: any;
  modalEdit: any;

  resetModal(){
    this.id = null;
    this.nama = '';
    this.langkah = '';
  }

  openModalTambah(isOpen: boolean){
    this.modalTambah = isOpen;
    this.resetModal();
    this.modalTambah = true;
    this.modalEdit = false;
  }

  cancel(){
    this.modal.dismiss();
    this.modalTambah = false;
    this.modalEdit = false;
    this.resetModal();
  }

  tambahResep() {
    if (this.nama != '' && this.langkah != '') {
      let data = {
        nama: this.nama,
        langkah: this.langkah,
      }
      this.api.tambah(data, 'tambah.php')
        .subscribe({
          next: (hasil: any) => {
            this.resetModal();
            console.log('berhasil tambah resep');
            this.getResep();
            this.modalTambah = false;
            this.modal.dismiss();
          },
          error: (err: any) => {
            console.log('gagal tambah resep');
          }
        })
    } else {
      console.log('gagal tambah resep karena masih ada data yg kosong');
    }
  }
  hapusResep(id: any){
    this.api.hapus(id,
      'hapus.php?id=').subscribe({
        next: (res: any)=> {
          console.log('sukses', res);
          this.getResep();
          console.log('berhasil hapus data resep');
        },
        error: (error: any) => {
          console.log('gagal');
        }
      })
  }
  ambilResep(id: any) {
    this.api.lihat(id,
      'lihat.php?id=').subscribe({
        next: (hasil: any) => {
          console.log('sukses', hasil);
          let resep = hasil;
          this.id = resep.id;
          this.nama = resep.nama;
          this.langkah = resep.langkah;
        },
        error: (error: any) => {
          console.log('gagal ambil data');
        }
      })
  }

  openModalEdit(isOpen: boolean, idget: any) {
    this.modalEdit = isOpen;
    this.id = idget;
    console.log(this.id);
    this.ambilResep(this.id);
    this.modalTambah = false;
    this.modalEdit = true;
  }

  editResep() {
    let data = {
      id: this.id,
      nama: this.nama,
      langkah: this.langkah,
    }
    this.api.edit(data, 'edit.php')
      .subscribe({
        next: (hasil: any) => {
          console.log(hasil);
          this.resetModal();
          this.getResep();
          console.log('berhasil edit Resep');
          this.modalEdit = false;
          this.modal.dismiss();
        },
        error: (err: any) => {
          console.log('gagal edit Resep');
        }
      })
  }
  public alertButtons = [
    {
      text: 'Tidak',
      role: 'cancel',
      handler: () => {
        console.log('Tidak jadi hapus data');
      },
    },
    {
      text: 'Ya',
      role: 'confirm',
      handler: () => {
        this.hapusResep(this.selectedId);
      },
    },
  ];

  setResult(ev: any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
    this.selectedId = null;
  }

  confirmHapus(id: any) {
    this.selectedId = id;
  }
  
}
