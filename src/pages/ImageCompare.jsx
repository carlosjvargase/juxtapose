
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Share2, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import ImageComparator from "@/components/ImageComparator";

function ImageCompare() {
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [beforeUrl, setBeforeUrl] = useState("");
  const [afterUrl, setAfterUrl] = useState("");
  const [sliderPosition, setSliderPosition] = useState(50);
  const [beforeLabel, setBeforeLabel] = useState("Antes");
  const [afterLabel, setAfterLabel] = useState("Después");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [logo, setLogo] = useState(null);
  const [showElements, setShowElements] = useState(['labels']);
  const [showIframePreview, setShowIframePreview] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "before") {
          setBeforeImage(reader.result);
          setBeforeUrl("");
        } else if (type === "after") {
          setAfterImage(reader.result);
          setAfterUrl("");
        } else if (type === "logo") {
          setLogo(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlInput = (type, url) => {
    if (type === "before") {
      setBeforeUrl(url);
      setBeforeImage(url || null);
    } else {
      setAfterUrl(url);
      setAfterImage(url || null);
    }
  };

  const handleElementToggle = (element) => {
    setShowElements(prev => 
      prev.includes(element)
        ? prev.filter(e => e !== element)
        : [...prev, element]
    );
  };

  const generateIframeCode = () => {
    const currentUrl = window.location.href;
    const iframeCode = `<iframe src="${currentUrl}" width="100%" height="500" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(iframeCode);
    toast({
      title: "¡Código copiado!",
      description: "El código del iframe ha sido copiado al portapapeles.",
    });
  };

  const handleDownload = async () => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      canvas.width = 1200;
      canvas.height = 800;

      const loadImage = (src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      };

      const [imgBefore, imgAfter] = await Promise.all([
        loadImage(beforeImage),
        loadImage(afterImage)
      ]);

      // Dibujar imagen "después"
      ctx.drawImage(imgAfter, 0, 0, canvas.width, canvas.height);

      // Dibujar imagen "antes" con clip
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, canvas.width * (sliderPosition / 100), canvas.height);
      ctx.clip();
      ctx.drawImage(imgBefore, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Dibujar línea divisoria
      ctx.fillStyle = "white";
      ctx.fillRect(canvas.width * (sliderPosition / 100) - 1, 0, 2, canvas.height);

      // Dibujar círculo del slider
      const centerX = canvas.width * (sliderPosition / 100);
      const centerY = canvas.height / 2;
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#666";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - 8, centerY);
      ctx.lineTo(centerX + 8, centerY);
      ctx.stroke();

      // Dibujar elementos según configuración
      if (showElements.includes('labels')) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(20, 20, 100, 30);
        ctx.fillRect(canvas.width - 120, 20, 100, 30);
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText(beforeLabel, 30, 40);
        ctx.fillText(afterLabel, canvas.width - 110, 40);
      }

      if (showElements.includes('description') && description) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(20, canvas.height - 60, canvas.width - 40, 40);
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText(description, 30, canvas.height - 35);
      }

      if (showElements.includes('date') && date) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(20, canvas.height - 100, 200, 30);
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText(date, 30, canvas.height - 80);
      }

      if (showElements.includes('logo') && logo) {
        const logoImg = await loadImage(logo);
        const logoHeight = 40;
        const logoWidth = (logoImg.width / logoImg.height) * logoHeight;
        ctx.drawImage(logoImg, (canvas.width - logoWidth) / 2, 20, logoWidth, logoHeight);
      }

      const link = document.createElement("a");
      link.download = "comparacion.png";
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast({
        title: "¡Imagen descargada!",
        description: "La comparación ha sido guardada como imagen.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo descargar la imagen. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Comparador de Imágenes</h1>
          <p className="mt-2 text-gray-600">Sube dos imágenes o ingresa sus URLs para compararlas</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Imagen Antes</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "before")}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">URL de la imagen Antes</label>
              <input
                type="url"
                value={beforeUrl}
                onChange={(e) => handleUrlInput("before", e.target.value)}
                placeholder="https://ejemplo.com/imagen-antes.jpg"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Etiqueta Antes</label>
              <input
                type="text"
                value={beforeLabel}
                onChange={(e) => setBeforeLabel(e.target.value)}
                placeholder="Etiqueta 'Antes'"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Imagen Después</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "after")}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">URL de la imagen Después</label>
              <input
                type="url"
                value={afterUrl}
                onChange={(e) => handleUrlInput("after", e.target.value)}
                placeholder="https://ejemplo.com/imagen-despues.jpg"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Etiqueta Después</label>
              <input
                type="text"
                value={afterLabel}
                onChange={(e) => setAfterLabel(e.target.value)}
                placeholder="Etiqueta 'Después'"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción del Juxtapose</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe la comparación"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "logo")}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Elementos a mostrar</label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="labels"
                  checked={showElements.includes('labels')}
                  onCheckedChange={() => handleElementToggle('labels')}
                />
                <label htmlFor="labels" className="text-sm">Etiquetas</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="description"
                  checked={showElements.includes('description')}
                  onCheckedChange={() => handleElementToggle('description')}
                />
                <label htmlFor="description" className="text-sm">Descripción</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="date"
                  checked={showElements.includes('date')}
                  onCheckedChange={() => handleElementToggle('date')}
                />
                <label htmlFor="date" className="text-sm">Fecha</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="logo"
                  checked={showElements.includes('logo')}
                  onCheckedChange={() => handleElementToggle('logo')}
                />
                <label htmlFor="logo" className="text-sm">Logo</label>
              </div>
            </div>
          </div>
        </div>

        {beforeImage && afterImage && (
          <>
            <ImageComparator
              beforeImage={beforeImage}
              afterImage={afterImage}
              sliderPosition={sliderPosition}
              beforeLabel={beforeLabel}
              afterLabel={afterLabel}
              description={description}
              date={date}
              logo={logo}
              showElements={showElements}
              onSliderChange={setSliderPosition}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center space-x-4"
            >
              <Button onClick={() => setShowIframePreview(true)} className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Compartir como iframe
              </Button>
              <Button onClick={handleDownload} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Descargar imagen
              </Button>
            </motion.div>
          </>
        )}
      </motion.div>

      <Dialog open={showIframePreview} onOpenChange={setShowIframePreview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vista previa del iframe</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <ImageComparator
                beforeImage={beforeImage}
                afterImage={afterImage}
                sliderPosition={sliderPosition}
                beforeLabel={beforeLabel}
                afterLabel={afterLabel}
                description={description}
                date={date}
                logo={logo}
                showElements={showElements}
                onSliderChange={setSliderPosition}
              />
            </div>
            <Button
              onClick={generateIframeCode}
              className="mt-4 w-full"
            >
              Copiar código del iframe
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ImageCompare;
