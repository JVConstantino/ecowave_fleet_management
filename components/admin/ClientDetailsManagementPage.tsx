
import React, { useState, useEffect, useCallback } from 'react';
import { CondominiumInfo, ContactInfo, ContractDetails, MqttConfig, SupportInfo } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

interface ClientDetailsManagementPageProps {
  initialClientData: CondominiumInfo;
  onUpdateClientDetails: (clientId: string, updatedDetails: Partial<CondominiumInfo>) => Promise<CondominiumInfo | void>;
  onBackToList: () => void;
}

const ArrowLeftIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);

type EditableSection = 'contact' | 'contract' | 'mqtt' | 'support' | null;

const ClientDetailsManagementPage: React.FC<ClientDetailsManagementPageProps> = ({
  initialClientData,
  onUpdateClientDetails,
  onBackToList,
}) => {
  const [clientData, setClientData] = useState<CondominiumInfo>(initialClientData);
  const [editableSection, setEditableSection] = useState<EditableSection>(null);
  const [formData, setFormData] = useState<Partial<CondominiumInfo>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setClientData(initialClientData); // Ensure data is fresh if component re-renders with new initial data
    setFormData({}); // Reset form data when client changes
    setEditableSection(null); // Close any open edit sections
  }, [initialClientData]);

  const handleEdit = (section: EditableSection, currentData: any) => {
    setEditableSection(section);
    setSuccessMessage(null);
    setError(null);
    if (section === 'contact') setFormData({ contactInfo: { ...currentData } });
    else if (section === 'contract') setFormData({ contractDetails: { ...currentData } });
    else if (section === 'mqtt') setFormData({ mqttConfig: { ...currentData } });
    else if (section === 'support') setFormData({ supportInfo: { ...currentData } });
  };

  const handleCancel = () => {
    setEditableSection(null);
    setFormData({});
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, sectionKey: keyof CondominiumInfo) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const sectionData = prev[sectionKey] || {};
        return {
            ...prev,
            [sectionKey]: {
                // @ts-ignore
                ...sectionData,
                [name]: value,
            }
        };
    });
  };

  const handleSave = async (section: EditableSection) => {
    if (!section || !formData) return;
    
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let updatePayload: Partial<CondominiumInfo> = {};
      if (section === 'contact') updatePayload = { contactInfo: formData.contactInfo as ContactInfo };
      else if (section === 'contract') updatePayload = { contractDetails: formData.contractDetails as ContractDetails };
      else if (section === 'mqtt') updatePayload = { mqttConfig: formData.mqttConfig as MqttConfig };
      else if (section === 'support') updatePayload = { supportInfo: formData.supportInfo as SupportInfo };

      const updatedClient = await onUpdateClientDetails(clientData.id, updatePayload);
      if (updatedClient) {
        setClientData(updatedClient); // Update local state with the saved data
      }
      setSuccessMessage(`${section.charAt(0).toUpperCase() + section.slice(1)} details updated successfully!`);
      setEditableSection(null);
      setFormData({});
    } catch (err: any) {
      console.error(`Failed to update ${section} details:`, err);
      setError(err.message || `Failed to update ${section} details.`);
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(null), 3000); // Clear success message after 3s
    }
  };
  
  // Helper to render form fields or display text
  const renderField = (label: string, value: string | undefined | null, name: string, sectionKey: keyof CondominiumInfo, type: string = 'text', options?: {value: string, label: string}[]) => {
    const currentSectionData = formData[sectionKey] as any || clientData[sectionKey] as any;
    const displayValue = value || 'N/A';
    
    if (editableSection === sectionKey.toString().replace('Info','').replace('Details','').replace('Config','')  && sectionKey !== null) {
      if (type === 'textarea') {
        return (
          <div className="mb-3">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <textarea
              id={name}
              name={name}
              value={currentSectionData?.[name] || ''}
              onChange={(e) => handleChange(e, sectionKey)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        );
      } else if (type === 'select' && options) {
         return (
          <div className="mb-3">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <select
              id={name}
              name={name}
              value={currentSectionData?.[name] || ''}
              onChange={(e) => handleChange(e, sectionKey)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Selecione...</option>
              {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        );
      }
      return (
        <div className="mb-3">
          <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
          <input
            type={type}
            id={name}
            name={name}
            value={currentSectionData?.[name] || ''}
            onChange={(e) => handleChange(e, sectionKey)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      );
    }
    return (
      <div className="mb-2">
        <span className="text-sm font-medium text-gray-600">{label}: </span>
        <span className="text-sm text-gray-800 break-all">{displayValue}</span>
      </div>
    );
  };
  
  const sectionCard = (title: string, sectionKey: Extract<EditableSection, string>, dataObject: any, fields: {label: string, name: keyof typeof dataObject, type?: string, options?: {value: string, label: string}[]}[]) => {
    const currentSectionBeingEdited = editableSection === sectionKey;
    return (
      <Card title={title} className="mb-6">
        {fields.map(field => renderField(field.label, dataObject?.[field.name], String(field.name), `${sectionKey}Info` as keyof CondominiumInfo || `${sectionKey}Details` as keyof CondominiumInfo || `${sectionKey}Config` as keyof CondominiumInfo, field.type, field.options))}
         {currentSectionBeingEdited ? (
          <div className="mt-4 flex space-x-2">
            <Button onClick={() => handleSave(sectionKey)} isLoading={isLoading} size="sm" variant="primary">Salvar</Button>
            <Button onClick={handleCancel} size="sm" variant="secondary" disabled={isLoading}>Cancelar</Button>
          </div>
        ) : (
          <Button onClick={() => handleEdit(sectionKey, dataObject)} size="sm" variant="ghost" className="mt-2">Editar</Button>
        )}
      </Card>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <div>
           <Button onClick={onBackToList} variant="ghost" size="sm" leftIcon={<ArrowLeftIcon />} className="mb-2">
             Voltar para Lista de Clientes
           </Button>
          <h1 className="text-2xl font-bold text-gray-800">Gerenciar Cliente: {clientData.name}</h1>
          <p className="text-sm text-gray-500">ID: {clientData.id}</p>
        </div>
      </div>
      
      {isLoading && <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50"><Spinner size="lg" /></div>}
      {error && <Card className="mb-4 bg-red-50 border-red-300"><p className="text-red-700 p-3">{error}</p></Card>}
      {successMessage && <Card className="mb-4 bg-green-50 border-green-300"><p className="text-green-700 p-3">{successMessage}</p></Card>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {sectionCard('Informações de Contato', 'contact', clientData.contactInfo, [
            { label: 'Contato Primário (Nome)', name: 'primaryContactName' },
            { label: 'Email Primário', name: 'primaryContactEmail', type: 'email' },
            { label: 'Telefone Primário', name: 'primaryContactPhone', type: 'tel' },
            { label: 'Contato Secundário (Nome)', name: 'secondaryContactName' },
            { label: 'Email Secundário', name: 'secondaryContactEmail', type: 'email' },
            { label: 'Telefone Secundário', name: 'secondaryContactPhone', type: 'tel' },
          ])}
          
          {sectionCard('Detalhes do Contrato', 'contract', clientData.contractDetails, [
            { label: 'ID do Contrato', name: 'contractId' },
            { label: 'Data de Início', name: 'startDate', type: 'date' },
            { label: 'Data de Término', name: 'endDate', type: 'date' },
            { label: 'Nível de Serviço', name: 'serviceLevel', type: 'select', options: [{value: 'basic', label: 'Básico'}, {value: 'standard', label: 'Padrão'}, {value: 'premium', label: 'Premium'}] },
            { label: 'Notas do Contrato', name: 'notes', type: 'textarea' },
          ])}
        </div>
        <div>
          {sectionCard('Configurações MQTT', 'mqtt', clientData.mqttConfig, [
            { label: 'URL do Broker MQTT', name: 'brokerUrl', type: 'url' },
            { label: 'Usuário MQTT', name: 'username' },
            { label: 'Senha MQTT', name: 'password', type: 'password' },
            { label: 'Tópico Consumo Água Total', name: 'waterConsumptionTopic' },
            { label: 'Tópico Nível Caixa Superior', name: 'tankLevelSuperiorTopic' },
            { label: 'Tópico Nível Caixa Inferior', name: 'tankLevelInferiorTopic' },
            { label: 'Tópico Status Bomba', name: 'pumpStatusTopic' },
            { label: 'Tópico Pressão Concessionária', name: 'pressureConcessionaireTopic' },
            { label: 'Tópico Pressão Interna', name: 'pressureInternalTopic' },
            { label: 'Notas dos Tópicos', name: 'topicNotes', type: 'textarea' },
          ])}
           <p className="text-xs text-gray-500 mt-1 mb-4 italic px-1">Nota: As configurações MQTT são para referência e não estão ativamente conectadas no sistema atual.</p>

          {sectionCard('Informações de Suporte', 'support', clientData.supportInfo, [
            { label: 'Nível de Suporte', name: 'supportTier', type: 'select', options: [{value: 'bronze', label: 'Bronze'}, {value: 'silver', label: 'Prata'}, {value: 'gold', label: 'Ouro'}] },
            { label: 'Agente de Suporte Dedicado', name: 'dedicatedSupportAgentName' },
            { label: 'ID Último Ticket Suporte', name: 'lastSupportTicketId' },
            { label: 'Notas Internas de Suporte', name: 'internalSupportNotes', type: 'textarea' },
          ])}
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsManagementPage;
