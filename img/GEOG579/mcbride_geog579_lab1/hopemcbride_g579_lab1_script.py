# Geog579 Spring 2026; McBride; Lab 1: Spatial Autocorrelation with ArcPy

# Instructions:
# Based on the example given in Lesson 3, write a new Python script that can do the following

#     Calculate the Moran Coefficient for the dem dataset at different spatial resolutions. Reduce the resolution of the image by factors that go from 2 to 20. Increase the cell factor by 2 at a step. 
#         Deliverable: The complete script and outputs of any two increased cell factors.
#     Select two different Conceptualization of Spatial Relationships for Autocorrelation (Moran's I). Generate two lists of Moran Coefficients at the spatial resolutions stated above. (Optional: compare the two lists)
#         Deliverable: The two lists created for Moran Coefficients
#     Use try-except statement to catch errors where needed.
#         Deliverable: Try-except statements included in the above script


# Import modules
import arcpy

# Overwrite existing outputs
arcpy.env.overwriteOutput = True

# Set the workspace 
arcpy.env.workspace = r"C:\Users\Hope McBride\OneDrive - UW-Madison\GEOG579\Lab1"

# Set input raster
inRaster = "dem"
inCellSize = arcpy.GetRasterProperties_management(inRaster, "CELLSIZEX").getOutput(0)
outCellSize = inCellSize
inFileName = inRaster.split('.')[0]
outRaster = inRaster

# Set variables for Resample
resampleingType = "NEAREST"

# Set variables for RasterToPoint
field = "VALUE"

# Set variables for SpatialAutocorrelation (keep default/example values for the first run)
inputField = "grid_code"
generateReport = "NO_REPORT"
spatialRS = "INVERSE_DISTANCE"
distM = "EUCLIDEAN_DISTANCE"
std = "ROW"

# Set variables for the other two Conceptualization of Spatial Relationships for Autocorrelation (Moran's I)
spatialRS_IDsq = "INVERSE_DISTANCE_SQUARED"
spatialRS_KNN = "K_NEAREST_NEIGHBORS"


# Create lists to store the Moran Coefficients
# the original list (from the lab1_lesson3 script example) for the Moran Coefficients using the default inverse distance conceptualization of spatial relationships
moransIL = []
# list for the Moran Coefficients using the inverse distance squared conceptualization of spatial relationships
moransI_IDsq_L = []
# list for the Moran Coefficients using the k-nearest neighbors conceptualization of spatial relationships
moransI_KNN_L = []


# Loop through the reduction factors from 2 to 20, increasing by 2 at each step 
for redFactor in range(2, 21, 2):
    # Generate output file names
    redFactorStr = str(redFactor)
    outPoint = inFileName + redFactorStr + '.shp'

    # Geoprocessing
    try:
        # Resample when reduction factor > 1 and <= 20
        if (redFactor > 1) and (redFactor <= 20):
                outCellSize = str(int(inCellSize)*redFactor)
                outRaster = inFileName + redFactorStr
                arcpy.management.Resample(inRaster, outRaster, outCellSize, resampleingType)
        
        # Raster to point
        arcpy.conversion.RasterToPoint(outRaster, outPoint, field)


        # Compute the Moran Coefficient using the example default inverse distance conceptualization of spatial relationships
        moransI = arcpy.stats.SpatialAutocorrelation(outPoint, inputField, generateReport, spatialRS, distM, std, None, None, None)
        # Add the Moran Coefficient complete output to 'moransIL' list
        moransIL.append(moransI)


        # Compute the Moran Coefficient using the inverse distance squared conceptualization of spatial relationships
        moransI_IDsq = arcpy.stats.SpatialAutocorrelation(outPoint, inputField, generateReport, spatialRS_IDsq, distM, std, None, None, None)
        # Retrieve just the Moran Coefficient index value and convert it to a float to add it to the list
        moransI_IDsq_value = float(moransI_IDsq.getOutput(0))
        # Add the inverse distance squared Moran Coefficient to its list
        moransI_IDsq_L.append(moransI_IDsq_value)
        

        # Compute the Moran Coefficient using the k-nearest neighbors conceptualization of spatial relationships
        moransI_KNN = arcpy.stats.SpatialAutocorrelation(outPoint, inputField, generateReport, spatialRS_KNN, distM, std, None, None, None)
        # Retrieve the KNN Moran Coefficient index value, convert to a float to add it to its list 
        moransI_KNN_value = float(moransI_KNN.getOutput(0))
        # Add the k-nearest neighbors Moran Coefficient to its list
        moransI_KNN_L.append(moransI_KNN_value)

    except:
        # If an error occurred when running the tool, print out the error message.
        print(arcpy.GetMessages())


# Print the Moran Coefficient results for the default inverse distance conceptualization of spatial relationships    
print("Moran Coefficients using the inverse distance conceptualization of spatial relationships:")
for i in range(len(moransIL)):
    print(str(i+1), moransIL[i])

# Print the list containing the Moran Coefficients for the inverse distance squared conceptualization of spatial relationships
print("Moran Coefficients using the inverse distance squared conceptualization of spatial relationships:", moransI_IDsq_L)

#print the list containing the Moran Coefficients for the k-nearest neighbors conceptualization of spatial relationships
print("Moran Coefficients using the k-nearest neighbors conceptualization of spatial relationships:", moransI_KNN_L)

# Indicate that the script completed successfully
print("Script completed successfully.")

