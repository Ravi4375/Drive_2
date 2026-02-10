package com.genie.Drive_BE.repo;

import com.genie.Drive_BE.entity.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<FileEntity,Long> {
    List<FileEntity> findByTrashedFalseAndParentFolderIdIsNull();

    List<FileEntity> findByTrashedFalseAndParentFolderId(Long parentFolderId);

    List<FileEntity> findByTrashedFalseOrderByCreatedAtDesc();

    List<FileEntity> findByTrashedFalseAndStarredTrueOrderByCreatedAtDesc();

    List<FileEntity> findByTrashedFalseAndSharedTrueOrderByCreatedAtDesc();

    List<FileEntity> findByTrashedTrueOrderByCreatedAtDesc();
}
