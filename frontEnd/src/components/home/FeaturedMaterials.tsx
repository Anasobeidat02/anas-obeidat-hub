import {
  Brain,
  Code2,
  Database,
  Network,
  Server,
  Cpu,
  Cloud,
  FileCode,
  Boxes,
  Settings,
  Globe,
  CircuitBoard,
  Microchip,
  Search,
  Terminal,
  GitBranch,
  Calculator,
  BarChart,
  Layout,
} from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Material {
  title: string;
  icon: JSX.Element;
  url: string;
  color: string;
}

const materials: Material[] = [
  {
    title: "Algorithms",
    icon: <Code2 className="h-8 w-8" />,
    url: "https://drive.google.com/drive/folders/1DzgD515Yi8S1NJQhvpaNJnWtKWs__4Ly?usp=drive_link",
    color: "text-blue-600"
  },
  {
    title: "Architecture",
    icon: <Cpu className="h-8 w-8" />,
    url: "https://drive.google.com/drive/folders/11FLPM4gZa-XzMvkqeb1R9D3PJY7nzyVY?usp=drive_link",
    color: "text-purple-600"
  },
  {
    title: "Artificial Intelligence",
    icon: <Brain className="h-8 w-8" />,
    url: "https://drive.google.com/drive/folders/1_83FOWh8xB6zsj0ZcNQLrfFyyhxR17zW?usp=drive_link",
    color: "text-green-600"
  },
  {
    title: "Automata",
    icon: <Settings className="h-8 w-8" />,
    url: "https://drive.google.com/drive/folders/1GPutR0oulr9F3ZqjurH5m_853zlsxGOd?usp=drive_link",
    color: "text-orange-600"
  },
  {
    title: "C++",
    icon: <FileCode className="h-8 w-8" />,
    url: "https://drive.google.com/drive/folders/1EZWRhOCXE4Q9rn7lvOqSBC4w0hg2-Bid?usp=drive_link",
    color: "text-blue-500"
  },
  {
    title: "Cloud Computing",
    icon: <Cloud className="h-8 w-8" />,
    url: "https://drive.google.com/drive/folders/1t78LeeYkCa68xpbL-Kytikx3jR6sWUiX?usp=drive_link",
    color: "text-sky-500"
  },
  {
    title: "Compilers",
    icon: <FileCode className="h-8 w-8" />,
    url: "https://drive.google.com/drive/folders/1dwNm3Z4KEFvL8ZJhU2w7G6VwExvwLQC0?usp=drive_link",
    color: "text-cyan-600"
  },
  {
    title: "Computer Networks",
    icon: <Network className="h-8 w-8" />,
    url: "https://drive.google.com/drive/folders/1GxXL3ZcesBgkre1AikjwA6se0R0jklAO?usp=drive_link",
    color: "text-blue-700"
  },
  {
    title: "Networks & Security",
    icon: <Network className="h-8 w-8" />,
    url: "https://drive.google.com/drive/folders/1nvvDcfvOaCH0aOUNQ3LgjO5HTjxHYiIo?usp=drive_link",
    color: "text-indigo-600"
  },
  {
    title: "Data Structures",
    icon: <Boxes className="h-8 w-8" />,
    url: "https://drive.google.com/drive/folders/1h1bnzxEKubZVTBSFbEGghDOLLq8CwQcv?usp=drive_link",
    color: "text-yellow-600"
  },
  {
    title: "Database",
    icon: <Database className="h-8 w-8" />,
    url: "https://drive.google.com/drive/folders/1cQgvRlgDZnZEw5p9NQxleo9sT42wUyt4?usp=drive_link",
    color: "text-red-600"
  },
  {
    title: "Digital Logic",
    icon: <CircuitBoard className="h-8 w-8" />,
    url: "https://drive.google.com/drive/folders/1Ad7w4NQ55DxFYgkJVcB31bMTEvCw3JwX?usp=drive_link",
    color: "text-gray-600"
  },
  {
    title: "Arduino",
    icon: <Microchip className="h-8 w-8" />,
    url: "https://drive.google.com/drive/folders/10JQIximopuJOQtJGTQoYpFb-iuOqFik5?usp=drive_link",
    color: "text-teal-500"
  },
  {
    title: "Information Retrieval",
    icon: <Search className="h-8 w-8" />,
    url: "https://drive.google.com/drive/folders/1EO-Zi7x-WEQTCTyVceXlEYwVfEhQNF2S?usp=drive_link",
    color: "text-orange-500"
  },
  {
    title: "Introduction to Computer Programming",
    icon: <Terminal className="h-8 w-8" />,
    url: "https://drive.google.com/drive/folders/154VD4b43_iysocsjx__KgQRHbBWTCNAR?usp=drive_link",
    color: "text-green-500"
  },
  {
    title: "Java",
    icon: <FileCode className="h-8 w-8" />,
    url: "https://drive.google.com/drive/folders/17gN3b3t3I6DARVUfLssL3BLVtviWcaWf?usp=drive_link",
    color: "text-red-500"
  },
  {
    title: "Modern Software Engineering",
    icon: <GitBranch className="h-8 w-8" />,
    url: "https://drive.google.com/drive/folders/1ogQBMUkbKhwtlx_HhYdl1rc1ssm7ceVj?usp=drive_link",
    color: "text-purple-500"
  },
  {
    title: "Numerical Analysis",
    icon: <Calculator className="h-8 w-8" />,
    url: "https://drive.google.com/drive/folders/1IkFRXhWVwUkE-vaJpHAVZ2C8w2ri982w?usp=drive_link",
    color: "text-yellow-500"
  },
  {
    title: "Prob And Statics",
    icon: <BarChart className="h-8 w-8" />,
    url: "https://drive.google.com/drive/folders/1xLpCI33YEoxBud1byK0FmU5epT4dsXLM?usp=drive_link",
    color: "text-indigo-500"
  },
  {
    title: "Operating Systems",
    icon: <Server className="h-8 w-8" />,
    url: "https://drive.google.com/drive/folders/18XF0KhLujfD9KJyTyociN4940HEhWj-I?usp=drive_link",
    color: "text-emerald-600"
  },
  {
    title: "System Analysis and Design",
    icon: <Layout className="h-8 w-8" />,
    url: "https://drive.google.com/drive/folders/1hgQS-q7biHSGr541RrgJmgS50EL9c2bl?usp=drive_link",
    color: "text-pink-500"
  },
  {
    title: "Web Development",
    icon: <Globe className="h-8 w-8" />,
    url: "https://drive.google.com/drive/folders/1defq7PEnQaOQlX5e4lQsBk1OuBt2mWeR?usp=drive_link",
    color: "text-teal-600"
  }
];

const FeaturedMaterials = () => {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Educational Materials
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Access comprehensive study materials and resources for various computer science topics.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {materials.map((material, index) => (
            <a
              key={index}
              href={material.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
              aria-label={`Open ${material.title} resources in a new tab`}
            >
              <Card className="p-4 text-center hover:shadow-lg transition-shadow duration-200 h-full flex flex-col items-center justify-center gap-3">
                <div className={`${material.color}`}>
                  {material.icon}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {material.title}
                </span>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMaterials;
