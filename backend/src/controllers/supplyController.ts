
import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse, CreateSupplyInput, UpdateSupplyInput } from '../types';

export const getAllSupplies = async (req: Request, res: Response) => {
  try {
    const supplies = await prisma.supply.findMany({
      include: {
        medicine: true,
        store: true
      },
      orderBy: { created_at: 'desc' }
    });

    const response: ApiResponse = {
      success: true,
      data: supplies,
      message: 'Supplies retrieved successfully'
    };

    return res.json(response);
  } catch (error) {
    console.error('Error fetching supplies:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch supplies'
    };
    return res.status(500).json(response);
  }
};

export const getSupplyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supply = await prisma.supply.findUnique({
      where: { supply_id: parseInt(id) },
      include: {
        medicine: true,
        store: true
      }
    });

    if (!supply) {
      const response: ApiResponse = {
        success: false,
        error: 'Supply record not found'
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      data: supply,
      message: 'Supply record retrieved successfully'
    };

    return res.json(response);
  } catch (error) {
    console.error('Error fetching supply:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch supply record'
    };
    return res.status(500).json(response);
  }
};

export const createSupply = async (req: Request, res: Response) => {
  try {
    const supplyData: CreateSupplyInput = req.body;

    // Verify medicine and store exist
    const [medicine, store] = await Promise.all([
      prisma.medicine.findUnique({ where: { id: supplyData.medicine_id } }),
      prisma.medicalStore.findUnique({ where: { store_id: supplyData.store_id } })
    ]);

    if (!medicine) {
      const response: ApiResponse = {
        success: false,
        error: 'Medicine not found'
      };
      return res.status(404).json(response);
    }

    if (!store) {
      const response: ApiResponse = {
        success: false,
        error: 'Medical store not found'
      };
      return res.status(404).json(response);
    }

    const supply = await prisma.supply.create({
      data: {
        ...supplyData,
        supply_date: new Date(supplyData.supply_date)
      },
      include: {
        medicine: true,
        store: true
      }
    });

    const response: ApiResponse = {
      success: true,
      data: supply,
      message: 'Supply record created successfully'
    };

    return res.status(201).json(response);
  } catch (error: any) {
    console.error('Error creating supply:', error);
    if (error.code === 'P2002') {
      const response: ApiResponse = {
        success: false,
        error: 'Supply record already exists for this medicine, store, and date combination'
      };
      return res.status(409).json(response);
    }
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create supply record'
    };
    return res.status(500).json(response);
  }
};

export const updateSupply = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdateSupplyInput = req.body;

    const processedData = {
      ...updateData,
      ...(updateData.supply_date && { supply_date: new Date(updateData.supply_date) })
    };

    const supply = await prisma.supply.update({
      where: { supply_id: parseInt(id) },
      data: processedData,
      include: {
        medicine: true,
        store: true
      }
    });

    const response: ApiResponse = {
      success: true,
      data: supply,
      message: 'Supply record updated successfully'
    };

    return res.json(response);
  } catch (error: any) {
    console.error('Error updating supply:', error);
    if (error.code === 'P2025') {
      const response: ApiResponse = {
        success: false,
        error: 'Supply record not found'
      };
      return res.status(404).json(response);
    }
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update supply record'
    };
    return res.status(500).json(response);
  }
};

export const deleteSupply = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.supply.delete({
      where: { supply_id: parseInt(id) }
    });

    const response: ApiResponse = {
      success: true,
      message: 'Supply record deleted successfully'
    };

    return res.json(response);
  } catch (error: any) {
    console.error('Error deleting supply:', error);
    if (error.code === 'P2025') {
      const response: ApiResponse = {
        success: false,
        error: 'Supply record not found'
      };
      return res.status(404).json(response);
    }
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete supply record'
    };
    return res.status(500).json(response);
  }
};

export const getMedicinesByStore = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params;

    const supplies = await prisma.supply.findMany({
      where: { store_id: parseInt(storeId) },
      include: {
        medicine: true,
        store: true
      },
      orderBy: { supply_date: 'desc' }
    });

    const response: ApiResponse = {
      success: true,
      data: supplies,
      message: 'Medicines supplied to store retrieved successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching medicines by store:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch medicines supplied to store'
    };
    res.status(500).json(response);
  }
};

export const getStoresByMedicine = async (req: Request, res: Response) => {
  try {
    const { medicineId } = req.params;

    const supplies = await prisma.supply.findMany({
      where: { medicine_id: parseInt(medicineId) },
      include: {
        medicine: true,
        store: true
      },
      orderBy: { supply_date: 'desc' }
    });

    const response: ApiResponse = {
      success: true,
      data: supplies,
      message: 'Stores that received medicine retrieved successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching stores by medicine:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch stores that received medicine'
    };
    res.status(500).json(response);
  }
};
