
import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse, CreateMedicineInput, UpdateMedicineInput } from '../types';

export const getAllMedicines = async (req: Request, res: Response) => {
  try {
    const medicines = await prisma.medicine.findMany({
      orderBy: { created_at: 'desc' }
    });

    const response: ApiResponse = {
      success: true,
      data: medicines,
      message: 'Medicines retrieved successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching medicines:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch medicines'
    };
    res.status(500).json(response);
  }
};

export const getMedicineById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const medicine = await prisma.medicine.findUnique({
      where: { id: parseInt(id) },
      include: {
        supplies: {
          include: {
            store: true
          }
        }
      }
    });

    if (!medicine) {
      const response: ApiResponse = {
        success: false,
        error: 'Medicine not found'
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      data: medicine,
      message: 'Medicine retrieved successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching medicine:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch medicine'
    };
    res.status(500).json(response);
  }
};

export const createMedicine = async (req: Request, res: Response) => {
  try {
    const medicineData: CreateMedicineInput = req.body;

    const medicine = await prisma.medicine.create({
      data: {
        ...medicineData,
        date_of_manufacture: new Date(medicineData.date_of_manufacture),
        date_of_expiry: new Date(medicineData.date_of_expiry)
      }
    });

    const response: ApiResponse = {
      success: true,
      data: medicine,
      message: 'Medicine created successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating medicine:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create medicine'
    };
    res.status(500).json(response);
  }
};

export const updateMedicine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdateMedicineInput = req.body;

    const processedData = {
      ...updateData,
      ...(updateData.date_of_manufacture && { date_of_manufacture: new Date(updateData.date_of_manufacture) }),
      ...(updateData.date_of_expiry && { date_of_expiry: new Date(updateData.date_of_expiry) })
    };

    const medicine = await prisma.medicine.update({
      where: { id: parseInt(id) },
      data: processedData
    });

    const response: ApiResponse = {
      success: true,
      data: medicine,
      message: 'Medicine updated successfully'
    };

    res.json(response);
  } catch (error: any) {
    console.error('Error updating medicine:', error);
    if (error.code === 'P2025') {
      const response: ApiResponse = {
        success: false,
        error: 'Medicine not found'
      };
      return res.status(404).json(response);
    }
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update medicine'
    };
    res.status(500).json(response);
  }
};

export const deleteMedicine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.medicine.delete({
      where: { id: parseInt(id) }
    });

    const response: ApiResponse = {
      success: true,
      message: 'Medicine deleted successfully'
    };

    res.json(response);
  } catch (error: any) {
    console.error('Error deleting medicine:', error);
    if (error.code === 'P2025') {
      const response: ApiResponse = {
        success: false,
        error: 'Medicine not found'
      };
      return res.status(404).json(response);
    }
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete medicine'
    };
    res.status(500).json(response);
  }
};

export const getExpiringMedicines = async (req: Request, res: Response) => {
  try {
    const { days = 30 } = req.query;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(days as string));

    const medicines = await prisma.medicine.findMany({
      where: {
        date_of_expiry: {
          lte: expiryDate
        }
      },
      orderBy: { date_of_expiry: 'asc' }
    });

    const response: ApiResponse = {
      success: true,
      data: medicines,
      message: `Medicines expiring within ${days} days retrieved successfully`
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching expiring medicines:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch expiring medicines'
    };
    res.status(500).json(response);
  }
};
