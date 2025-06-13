
import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse, CreateStoreInput, UpdateStoreInput } from '../types';

export const getAllStores = async (req: Request, res: Response) => {
  try {
    const stores = await prisma.medicalStore.findMany({
      orderBy: { created_at: 'desc' }
    });

    const response: ApiResponse = {
      success: true,
      data: stores,
      message: 'Medical stores retrieved successfully'
    };

    return res.json(response);
  } catch (error) {
    console.error('Error fetching stores:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch medical stores'
    };
    return res.status(500).json(response);
  }
};

export const getStoreById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const store = await prisma.medicalStore.findUnique({
      where: { store_id: parseInt(id) },
      include: {
        supplies: {
          include: {
            medicine: true
          }
        }
      }
    });

    if (!store) {
      const response: ApiResponse = {
        success: false,
        error: 'Medical store not found'
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      data: store,
      message: 'Medical store retrieved successfully'
    };

    return res.json(response);
  } catch (error) {
    console.error('Error fetching store:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch medical store'
    };
    return res.status(500).json(response);
  }
};

export const createStore = async (req: Request, res: Response) => {
  try {
    const storeData: CreateStoreInput = req.body;

    const store = await prisma.medicalStore.create({
      data: storeData
    });

    const response: ApiResponse = {
      success: true,
      data: store,
      message: 'Medical store created successfully'
    };

    return res.status(201).json(response);
  } catch (error) {
    console.error('Error creating store:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create medical store'
    };
    return res.status(500).json(response);
  }
};

export const updateStore = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdateStoreInput = req.body;

    const store = await prisma.medicalStore.update({
      where: { store_id: parseInt(id) },
      data: updateData
    });

    const response: ApiResponse = {
      success: true,
      data: store,
      message: 'Medical store updated successfully'
    };

    return res.json(response);
  } catch (error: any) {
    console.error('Error updating store:', error);
    if (error.code === 'P2025') {
      const response: ApiResponse = {
        success: false,
        error: 'Medical store not found'
      };
      return res.status(404).json(response);
    }
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update medical store'
    };
    return res.status(500).json(response);
  }
};

export const deleteStore = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.medicalStore.delete({
      where: { store_id: parseInt(id) }
    });

    const response: ApiResponse = {
      success: true,
      message: 'Medical store deleted successfully'
    };

    return res.json(response);
  } catch (error: any) {
    console.error('Error deleting store:', error);
    if (error.code === 'P2025') {
      const response: ApiResponse = {
        success: false,
        error: 'Medical store not found'
      };
      return res.status(404).json(response);
    }
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete medical store'
    };
    return res.status(500).json(response);
  }
};

export const getStoresByLocation = async (req: Request, res: Response) => {
  try {
    const { location } = req.params;
    const stores = await prisma.medicalStore.findMany({
      where: {
        OR: [
          {
            city: {
              contains: location,
              mode: 'insensitive'
            }
          },
          {
            state: {
              contains: location,
              mode: 'insensitive'
            }
          },
          {
            pin_code: {
              contains: location,
              mode: 'insensitive'
            }
          }
        ]
      },
      orderBy: { store_name: 'asc' }
    });

    const response: ApiResponse = {
      success: true,
      data: stores,
      message: `Medical stores in ${location} retrieved successfully`
    };

    return res.json(response);
  } catch (error) {
    console.error('Error fetching stores by location:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch medical stores by location'
    };
    return res.status(500).json(response);
  }
};
