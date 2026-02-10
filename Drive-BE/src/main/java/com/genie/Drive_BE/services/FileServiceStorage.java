package com.genie.Drive_BE.services;

import com.genie.Drive_BE.entity.FileEntity;
import com.genie.Drive_BE.repo.FileRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FileServiceStorage {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private final FileRepository fileRepository;

    public FileServiceStorage(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    public String saveFile(MultipartFile file, Long parentFolderId) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        FileEntity fileEntity = new FileEntity();
        fileEntity.setName(fileName);
        fileEntity.setPath(filePath.toString());
        fileEntity.setSize(file.getSize());
        fileEntity.setType("file");
        fileEntity.setParentFolderId(parentFolderId);
        fileEntity.setStarred(false);
        fileEntity.setTrashed(false);
        fileEntity.setShared(false);
        fileEntity.setCreatedAt(LocalDateTime.now());

        fileRepository.save(fileEntity);

        return "File uploaded Successfully!";
    }

    public List<FileEntity> getFilesInFolder(Long parentFolderId) {
        if (parentFolderId == null) {
            return fileRepository.findByTrashedFalseAndParentFolderIdIsNull();
        }
        return fileRepository.findByTrashedFalseAndParentFolderId(parentFolderId);
    }

    public List<FileEntity> getRecentFiles() {
        return fileRepository.findByTrashedFalseOrderByCreatedAtDesc();
    }

    public List<FileEntity> getStarredFiles() {
        return fileRepository.findByTrashedFalseAndStarredTrueOrderByCreatedAtDesc();
    }

    public List<FileEntity> getSharedFiles() {
        return fileRepository.findByTrashedFalseAndSharedTrueOrderByCreatedAtDesc();
    }

    public List<FileEntity> getTrashFiles() {
        return fileRepository.findByTrashedTrueOrderByCreatedAtDesc();
    }

    public FileEntity getFileById(Long id) {
        return fileRepository.findById(id).orElseThrow(() -> new RuntimeException("File not found"));
    }

    public void moveToTrash(Long id) {
        FileEntity fileEntity = getFileById(id);
        fileEntity.setTrashed(true);
        fileRepository.save(fileEntity);
    }

    public void restoreFromTrash(Long id) {
        FileEntity fileEntity = getFileById(id);
        fileEntity.setTrashed(false);
        fileRepository.save(fileEntity);
    }

    public FileEntity toggleStar(Long id) {
        FileEntity fileEntity = getFileById(id);
        boolean starred = Boolean.TRUE.equals(fileEntity.getStarred());
        fileEntity.setStarred(!starred);
        return fileRepository.save(fileEntity);
    }

    public void deleteById(Long id) {
        fileRepository.deleteById(id);
    }

    public Map<String, Object> getStorageSummary() {
        long totalBytes = fileRepository.findAll()
                .stream()
                .filter(f -> !Boolean.TRUE.equals(f.getTrashed()))
                .mapToLong(f -> f.getSize() == null ? 0L : f.getSize())
                .sum();

        long maxBytes = 15L * 1024 * 1024 * 1024;
        double usedPercentage = maxBytes == 0 ? 0 : ((double) totalBytes / maxBytes) * 100;

        Map<String, Object> storageSummary = new HashMap<>();
        storageSummary.put("usedBytes", totalBytes);
        storageSummary.put("maxBytes", maxBytes);
        storageSummary.put("usedPercentage", Math.min(usedPercentage, 100));

        return storageSummary;
    }
}
