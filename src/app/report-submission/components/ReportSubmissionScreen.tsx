'use client';
import React, { useState } from 'react';
import ReportForm from './ReportForm';
import ClassificationPreview from './ClassificationPreview';
import RecentSubmissions from './RecentSubmissions';
import type { ClassificationResult } from './ClassificationPreview';

export default function ReportSubmissionScreen() {
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-screen-2xl mx-auto px-6 xl:px-10 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Reportar Incidente</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ingresa un reporte de redes sociales para clasificación automática con IA y geolocalización
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Form — 2/3 */}
          <div className="xl:col-span-2 space-y-6">
            <ReportForm
              onClassificationStart={() => {
                setIsClassifying(true);
                setClassification(null);
              }}
              onClassificationComplete={(result) => {
                setClassification(result);
                setIsClassifying(false);
              }}
            />
          </div>

          {/* Right panel — 1/3 */}
          <div className="space-y-6">
            <ClassificationPreview
              result={classification}
              isLoading={isClassifying}
            />
            <RecentSubmissions />
          </div>
        </div>
      </div>
    </div>
  );
}