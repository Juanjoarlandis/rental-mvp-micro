/* -------------------------------------------------------------- */
/*  CategoryGrid – primer clic rápido                              */
/* -------------------------------------------------------------- */
import { Link } from 'react-router-dom';
import Container from '../shared/Container';
import Section from '../shared/Section';
import {
  WrenchScrewdriverIcon,
  CameraIcon,
  DevicePhoneMobileIcon,
  AcademicCapIcon,
  PresentationChartBarIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

const CATS = [
  { icon: WrenchScrewdriverIcon, name: 'Herramientas' },
  { icon: TruckIcon,             name: 'Jardín' },
  { icon: CameraIcon,            name: 'Fotografía' },
  { icon: AcademicCapIcon,       name: 'Deporte' },
  { icon: DevicePhoneMobileIcon, name: 'Electrónica' },
  { icon: PresentationChartBarIcon, name: 'Bebé & movilidad' },
];

export default function CategoryGrid() {
  return (
    <Section title="Explora por categoría" className="bg-white dark:bg-gray-900">
      <Container>
        <p className="mx-auto mb-10 max-w-lg text-center text-gray-600 dark:text-gray-400">
          Busca por categoría y encuentra lo que necesitas en segundos
        </p>
        <div className="grid gap-6 sm:grid-cols-3 md:grid-cols-6">
          {CATS.map(({ icon: Icon, name }) => (
            <Link
              key={name}
              to={`/dashboard?cat=${encodeURIComponent(name)}`}
              className="
                group flex flex-col items-center gap-3 rounded-lg bg-gray-50 p-6
                text-center shadow transition hover:-translate-y-1 hover:bg-gray-100
                dark:bg-gray-800 dark:hover:bg-gray-700
              "
            >
              <Icon className="h-8 w-8 text-brand transition group-hover:scale-110" />
              <span className="text-sm font-medium">{name}</span>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
