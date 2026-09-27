import { LucideIcon } from 'lucide-react';
import {
  FileText,
  Store,
  ClipboardList,
  HeartHandshake,
  Baby,
  HeartPulse,
  Heart,
  Users,
} from 'lucide-react';

export interface Service {
  slug: string;
  name: string;
  icon: LucideIcon;
  description: string;
  estimate: string;
  fee: string;
  requirements: string[];
  procedure: string[];
  documents: string[];
}

export const services: Service[] = [
  {
    slug: 'surat-keterangan-domisili',
    name: 'Surat Keterangan Domisili',
    icon: FileText,
    description:
      'Surat resmi yang menerangkan domisili/tempat tinggal warga di wilayah Desa Sukamaju.',
    estimate: '1 hari kerja',
    fee: 'Gratis',
    requirements: [
      'Fotokopi KTP pemohon',
      'Fotokopi KK pemohon',
      'Membawa dokumen asli untuk verifikasi',
    ],
    procedure: [
      'Mengajukan permohonan secara online atau datang ke kantor desa',
      'Mengisi formulir pengajuan',
      'Petugas memverifikasi data domisili',
      'Surat dicetak dan ditandatangani Kepala Desa',
      'Surat dapat diambil di kantor desa',
    ],
    documents: ['KTP', 'Kartu Keluarga'],
  },
  {
    slug: 'surat-keterangan-usaha',
    name: 'Surat Keterangan Usaha',
    icon: Store,
    description:
      'Surat keterangan yang menyatakan bahwa pemiliknya memiliki usaha di wilayah Desa Sukamaju.',
    estimate: '1 hari kerja',
    fee: 'Gratis',
    requirements: [
      'Fotokopi KTP pemohon',
      'Fotokopi KK pemohon',
      'Foto tempat usaha',
    ],
    procedure: [
      'Mengajukan permohonan secara online atau datang ke kantor desa',
      'Mengisi formulir pengajuan',
      'Petugas melakukan verifikasi lapangan',
      'Surat dicetak dan ditandatangani Kepala Desa',
      'Surat dapat diambil di kantor desa',
    ],
    documents: ['KTP', 'Kartu Keluarga', 'Foto Tempat Usaha'],
  },
  {
    slug: 'surat-pengantar',
    name: 'Surat Pengantar',
    icon: ClipboardList,
    description:
      'Surat pengantar dari kepala desa untuk mengurus berbagai keperluan administrasi di instansi terkait.',
    estimate: '1 hari kerja',
    fee: 'Gratis',
    requirements: [
      'Fotokopi KTP pemohon',
      'Fotokopi KK pemohon',
      'Menyebutkan tujuan pengajuan',
    ],
    procedure: [
      'Mengajukan permohonan secara online atau datang ke kantor desa',
      'Mengisi formulir pengajuan dengan tujuan yang jelas',
      'Petugas memverifikasi data',
      'Surat dicetak dan ditandatangani Kepala Desa',
      'Surat dapat diambil di kantor desa',
    ],
    documents: ['KTP', 'Kartu Keluarga'],
  },
  {
    slug: 'surat-keterangan-tidak-mampu',
    name: 'Surat Keterangan Tidak Mampu',
    icon: HeartHandshake,
    description:
      'Surat keterangan yang menyatakan bahwa pemohon termasuk dalam kategori keluarga tidak mampu.',
    estimate: '2 hari kerja',
    fee: 'Gratis',
    requirements: [
      'Fotokopi KTP pemohon',
      'Fotokopi KK pemohon',
      'Pendukung data ekonomi (jika ada)',
    ],
    procedure: [
      'Mengajukan permohonan secara online atau datang ke kantor desa',
      'Mengisi formulir pengajuan',
      'Petugas melakukan verifikasi lapangan',
      'Hasil verifikasi disetujui Kepala Desa',
      'Surat dicetak dan dapat diambil di kantor desa',
    ],
    documents: ['KTP', 'Kartu Keluarga', 'Data Ekonomi'],
  },
  {
    slug: 'surat-keterangan-kelahiran',
    name: 'Surat Keterangan Kelahiran',
    icon: Baby,
    description:
      'Surat keterangan yang menerangkan kelahiran seorang warga di wilayah Desa Sukamaju.',
    estimate: '1 hari kerja',
    fee: 'Gratis',
    requirements: [
      'Fotokopi KTP ayah dan ibu',
      'Fotokopi KK',
      'Surat keterangan lahir dari bidan/dokter',
      'Bukti pernikahan orang tua',
    ],
    procedure: [
      'Mengajukan permohonan dalam 30 hari setelah kelahiran',
      'Mengisi formulir pengajuan',
      'Petugas memverifikasi dokumen',
      'Surat dicetak dan ditandatangani Kepala Desa',
      'Surat dapat diambil di kantor desa',
    ],
    documents: ['KTP Ayah & Ibu', 'Kartu Keluarga', 'Surat Bidan/Dokter'],
  },
  {
    slug: 'surat-keterangan-kematian',
    name: 'Surat Keterangan Kematian',
    icon: HeartPulse,
    description:
      'Surat keterangan yang menerangkan kematian seorang warga di wilayah Desa Sukamaju.',
    estimate: '1 hari kerja',
    fee: 'Gratis',
    requirements: [
      'Fotokopi KTP almarhum',
      'Fotokopi KK almarhum',
      'Surat keterangan mati dari dokter/bidan',
      'KTP pelapor',
    ],
    procedure: [
      'Mengajukan permohonan dalam 30 hari setelah kematian',
      'Mengisi formulir pengajuan',
      'Petugas memverifikasi dokumen',
      'Surat dicetak dan ditandatangani Kepala Desa',
      'Surat dapat diambil di kantor desa',
    ],
    documents: ['KTP Almarhum', 'Kartu Keluarga', 'Surat Dokter/Bidan'],
  },
  {
    slug: 'surat-pengantar-nikah',
    name: 'Surat Pengantar Nikah',
    icon: Heart,
    description:
      'Surat pengantar dari kepala desa untuk mengurus administrasi pernikahan di KUA.',
    estimate: '1 hari kerja',
    fee: 'Gratis',
    requirements: [
      'Fotokopi KTP calon suami dan istri',
      'Fotokopi KK',
      'Foto pas photo 2x3 (masing-masing 2 lembar)',
      'Izin orang tua (jika usia di bawah 21 tahun)',
    ],
    procedure: [
      'Mengajukan permohonan minimal 10 hari sebelum akad',
      'Mengisi formulir pengajuan',
      'Petugas memverifikasi dokumen',
      'Surat dicetak dan ditandatangani Kepala Desa',
      'Surat dapat diambil di kantor desa',
    ],
    documents: ['KTP', 'Kartu Keluarga', 'Pas Photo', 'Izin Orang Tua'],
  },
  {
    slug: 'administrasi-kependudukan',
    name: 'Layanan Administrasi Kependudukan',
    icon: Users,
    description:
      'Pengurusan administrasi kependudukan seperti perubahan data, pindah datang, dan pindah keluar.',
    estimate: '3–5 hari kerja',
    fee: 'Gratis',
    requirements: [
      'Fotokopi KTP pemohon',
      'Fotokopi KK pemohon',
      'Surat keterangan pindah (jika pindah datang/keluar)',
    ],
    procedure: [
      'Mengajukan permohonan secara online atau datang ke kantor desa',
      'Mengisi formulir pengajuan',
      'Petugas memverifikasi data',
      'Data diperbarui dalam sistem kependudukan',
      'Dokumen baru dapat diambil di kantor desa',
    ],
    documents: ['KTP', 'Kartu Keluarga', 'Surat Keterangan Pindah'],
  },
];
